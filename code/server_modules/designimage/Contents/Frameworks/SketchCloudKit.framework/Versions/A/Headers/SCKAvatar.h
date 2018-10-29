//  Created by Robin Speijer on 06-07-17.
//  Copyright © 2017 Bohemian Coding. 

typedef NS_ENUM(NSInteger, SCKAvatarType) {
    SCKAvatarTypeRandom = 0,
    SCKAvatarTypeUserDefined
} NS_SWIFT_NAME(Avatar.Type);

/// An avatar that could visually represent a Cloud user. This model object (optionally) contains some URLs to remote images. Loading those images themselves should happen in the app target.
NS_SWIFT_NAME(Avatar)
@interface SCKAvatar : NSObject

/// The dictionary that was used for parsing the user object, since avatar information has been appended to the user object in the server response data.
- (nonnull instancetype)initWithDictionary:(nonnull NSDictionary *)dictionary;

/// A dictionary that describes all needed fields to recreate the avatar object using initWithDictionary:.
@property (nonatomic, nonnull, readonly) NSDictionary *dictionaryRepresentation;

/// Whether the user has uploaded this artboard, or it's a random avatar that has been randomly picked.
@property (nonatomic, readonly) SCKAvatarType type;

/// The URL of a regular sized avatar image.
@property (nonatomic, nullable, readonly) NSURL *url;

/// The URL of a large sized avatar image.
@property (nonatomic, nullable, readonly) NSURL *largeURL;

@end
