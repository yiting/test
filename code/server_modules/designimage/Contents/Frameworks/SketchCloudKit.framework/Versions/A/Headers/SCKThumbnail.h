//  Created by Robin Speijer on 01-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKObject.h"

NS_SWIFT_NAME(Thumbnail)
@interface SCKThumbnail : SCKObject

@property (nonatomic, nullable, readonly) NSURL *URL;
@property (nonatomic, readonly) CGSize dimensions;
@property (nonatomic, readonly) NSUInteger fileSize;

@end
