//
//  Created by Gavin on 03/06/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

#import "BCJSONEncoder.h"

NS_ASSUME_NONNULL_BEGIN

@protocol BCJSONDecoderDelegate <NSObject>
/// Returns NO if instances of \c aClass should not be created.
/// This method can be provided by the delegate to help protect against object substitution attacks.
- (BOOL)decoder:(nonnull BCJSONDecoder*)decoder shouldInstantiateObjectOfClass:(nonnull Class)aClass;
@end


/// The BCJSONDecoder class can be used to decode data in similar way to how
/// NSKeyedUnarchiver etc work.
@interface BCJSONDecoder : NSObject

/**
 Adds a class translation mapping to BCJSONDecoder whereby objects encoded with a given
 class name are decoded as instances of a given class instead.
 If \c class is nil any objects with the given class name in the JSON will be ignored
 (decodeObject:forKey:) will return nil. The same is true of setting [NSNull class].

 Note that this method is not thread safe; calling it at the same time as decoding from
 elsewhere could cause problems. The expected behaviour is that this method is called from
 one place, on a single thread, at startup and not called again after that.
 */
+ (void)setClass:(nullable Class)class forClassName:(nonnull NSString *)codedName;

/// The \c userInfo property can be used by a consumer of this class to attach
/// information pertinent to this current decoding.
@property (nonatomic,weak,nullable) id userInfo;

/// Returns any error that has been encountered during the decoding
@property (nonatomic, copy) NSError* error;

/// The delegate property - can be used to confirm aspect of loading
@property (nonatomic,weak,nullable) id<BCJSONDecoderDelegate> delegate;

/// Decodes the contents of the file at \c url into an object tree.
/// If an error occurs, this method will return nil with \c error filled in.
+ (nullable id)decodeFileAtURL:(NSURL*)url error:(NSError* __nullable __autoreleasing * __nullable)error;

/// Decodes the contents of \c data into an object tree.
/// If an error occurs, this method will return nil with \c error filled in.
+ (nullable id)decodeData:(NSData*)data error:(NSError* __nullable __autoreleasing * __nullable)error;

/// Parses the JSON data in \c data into an object tree.
/// If an error occurs, this method will return nil with \c error filled in.
- (nullable id)decodeData:(NSData*)data error:(NSError* __nullable __autoreleasing * __nullable)error;

/// Parses an NSDictionary representation of JSON data into an object tree.
/// If an error occurs, this method will return nil with \c error filled in.
- (nullable id)decodeDictionary:(NSDictionary*)dict error:(NSError* __nullable __autoreleasing * __nullable)error;

/// Returns YES if the archive contains a value stored against \c key
- (BOOL)containsValueForKey:(NSString*)key;

/// Decodes any instance of an object stored under \c key
- (nullable id)decodeObjectForKey:(NSString*)key;

/// Decodes any double stored under \c key
- (double)decodeDoubleForKey:(NSString*)key withDefault:(double)defaultValue;

/// Decodes any BOOL stored under \c key
- (BOOL)decodeBoolForKey:(NSString*)key withDefault:(BOOL)defaultValue;

/// Decodes any Rect stored under \c key
- (CGRect)decodeRectForKey:(NSString*)key withDefault:(CGRect)defaultValue;

/// Decodes any Point stored under \c key
- (CGPoint)decodePointForKey:(NSString*)key withDefault:(CGPoint)defaultValue;

/// Decodes any integer stored under \c key
- (NSInteger)decodeIntegerForKey:(NSString*)key withDefault:(NSInteger)defaultValue;

/// Decodes any Size stored under \c key
- (CGSize)decodeSizeForKey:(NSString*)key withDefault:(CGSize)defaultValue;

@end

NS_ASSUME_NONNULL_END
