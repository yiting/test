//  Created by Robin Speijer on 01-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKObject.h"
#import "SCKFileImageType.h"

@class SCKThumbnail;

NS_SWIFT_NAME(File)
@interface SCKFile : SCKObject

@property (nonatomic, readonly) CGSize dimensions;
@property (nonatomic, readonly) NSUInteger fileSize;
@property (nonatomic, readonly) CGFloat scale;
@property (nonatomic, nonnull, readonly) NSArray<SCKThumbnail *> *thumbnails;
@property (nonatomic, nullable, readonly) NSURL *url;
@property (nonatomic, readonly) SCKFileImageType type;

/**
 Picks the largest possible thumbnail constrained to a maximum size. If there are no thumbnails that are big enough for the given size, a smaller thumbnail will be picked.

 @param size The minimum size of the thumbnail in pixels.
 @return A thumbnail that best suits the given size.
 */
- (nullable SCKThumbnail *)thumbnailConstrainedToSize:(CGSize)size NS_SWIFT_NAME(thumbnail(constrainedTo:));
    
@end
