//  Created by Gavin on 02/06/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.


@class BCJSONEncoder;
@class BCJSONDecoder;


/// This is similar to method to NSCoder for
/// Objects being serialised as JSON should implement this protocol
@protocol BCJSONEncoding <NSObject>

/// Encode the contents of the receiver into coder.
/// This is the equivalent of encodeWithCoder: on NSCoder.
- (void)encodeAsJSON:(nonnull BCJSONEncoder*)coder;

/// Decode the contents of the decoder into a new object.
/// This is the equivalent of initWithCoder: on NSCoder
- (nonnull instancetype)initWithJSONDecoder:(nonnull BCJSONDecoder*)decoder;

@optional

/// Just before an object is encoded we want to be able to check whether we should
/// use a different object instead. This is similar to NSCoder's replacementObjectForCoder:
/// method.
- (nonnull NSObject*)replacementObjectForJSONEncoder:(nonnull BCJSONEncoder*)coder;

@end


/// The BCJSONEncoder class can be used to encode data as JSON similar to the way
/// NSKeyedArchiver etc work.
/// Instances of BCJSONEncoder should not be created directly.
/// Instead encoding should take place via encodeObject:to... methods.
@interface BCJSONEncoder : NSObject

/**
 Provides BCJSONEncoder with an alias to use as the class name for a class.
 An alias mapping can be removed by passing nil for the codedName.
 
 Note that this method is not thread safe; calling it at the same time as decoding from
 elsewhere could cause problems. The expected behaviour is that this method is called from
 one place, on a single thread, at startup and not called again after that.
*/
+ (void)setAliasName:(nullable NSString *)codedName forClass:(nonnull Class)class;

/// The \c userInfo property can be used by a consumer of this class to attach
/// information pertinent to this current decoding.
@property (nonatomic,weak,nullable) id userInfo;

/// Encodes the root object
- (BOOL)encodeRootObject:(nullable NSObject*)root error:(NSError * __nullable __autoreleasing * __nullable)error;

/// Encodes the passed in object and stores it as key
- (void)encodeObject:(nullable NSObject*)object forKey:(nonnull NSString*)key;

/// Encodes the passed in double value and stores it as key
- (void)encodeDouble:(double)value forKey:(nonnull NSString*)key;

/// Encodes the passed in bool value and stores it as key
- (void)encodeBool:(BOOL)value forKey:(nonnull NSString*)key;

/// Encodes the passed in rect value and stores it as key
- (void)encodeRect:(CGRect)rect forKey:(nonnull NSString*)key;

/// Encodes the passed in point value and stores it as key
- (void)encodePoint:(CGPoint)point forKey:(nonnull NSString*)key;

/// Encodes the passed in integer value and stores it as key
- (void)encodeInteger:(NSInteger)value forKey:(nonnull NSString*)key;

/// Encodes the passed in size value and stores it as key
- (void)encodeSize:(CGSize)size forKey:(nonnull NSString*)key;

/// Contains any error encountered during encoding.
@property (nonatomic,copy,nullable) NSError *error;

@end
