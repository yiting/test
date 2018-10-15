//
//  SCKFile.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 01-02-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKObject.h"

@class SCKThumbnail;

@interface SCKFile : SCKObject

@property (nonatomic, readonly) CGSize dimensions;
@property (nonatomic, readonly) NSUInteger fileSize;
@property (nonatomic, readonly) CGFloat scale;
@property (nonatomic, nonnull, readonly) NSArray<SCKThumbnail *> *thumbnails;
@property (nonatomic, nullable, readonly) NSURL *url;

/**
 Picks the largest possible thumbnail constrained to a maximum size. If there are no thumbnails that are big enough for the given size, a smaller thumbnail will be picked.

 @param size The minimum size of the thumbnail in pixels.
 @return A thumbnail that best suits the given size.
 */
- (nullable SCKThumbnail *)thumbnailConstrainedToSize:(CGSize)size NS_SWIFT_NAME(thumbnail(constrainedTo:));
    
@end
