//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Bohemian Coding. 

typedef NSString SCKObjectID;

/// A generic Cloud object. Contains some attributes that are part of all objects on the Cloud server.
NS_SWIFT_NAME(Object)
@interface SCKObject : NSObject <NSSecureCoding>

/// Initializes the object using the given server response data.
- (nullable instancetype)initWithData:(nullable NSData *)data error:(NSError * _Nullable __autoreleasing * _Nullable)error;

/// Initializes the object using the given server dictionary. This dictionary is part of the API response.
- (nullable instancetype)initWithDictionary:(nonnull NSDictionary *)dictionary;

/// Initializes the object using the given server dictionary. This dictionary is part of the API response.
- (nullable instancetype)initWithDictionary:(nonnull NSDictionary *)dictionary parentObject:(nullable SCKObject *)parent;

/// Initializes a new empty Cloud object with a predefined objectID.
- (nonnull instancetype)initWithObjectID:(nonnull SCKObjectID *)objectID;

/// A back-reference to the object where this object is part of.
@property (nonatomic, nullable, weak, readonly) SCKObject *parent;

/// The identifier of the object.
@property (nonatomic, nonnull, readonly) SCKObjectID *objectID;

/// When the object has been created by the user.
@property (nonatomic, nullable, readonly) NSDate *creationDate;

/// When the object has been updated by the user.
@property (nonatomic, nullable, readonly) NSDate *updateDate;

/// When the object has been deleted by the user.
@property (nonatomic, nullable, readonly) NSDate *deletionDate;

/// A dictionary representation that can for example be posted to the API.
@property (nonatomic, nonnull, readonly) NSDictionary *dictionaryRepresentation;

@end
