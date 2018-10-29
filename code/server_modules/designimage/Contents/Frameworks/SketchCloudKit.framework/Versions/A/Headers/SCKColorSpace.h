//  Created by Robin Speijer on 14-11-17.
//  Copyright © 2017 Bohemian Coding. 

@import Foundation;

#ifndef SCKColorSpace_h
#define SCKColorSpace_h

typedef NS_ENUM(NSUInteger, SCKColorSpace) {
    SCKColorSpaceUnmanaged = 0,
    SCKColorSpaceSRGB = 1,
    SCKColorSpaceDisplayP3 = 2
} NS_SWIFT_NAME(ColorSpace);

SCKColorSpace SCKColorSpaceFromString(NSString * _Nullable string) CF_SWIFT_NAME(ColorSpace.init(stringValue:));
NSString * _Nullable SCKColorSpaceGetString(SCKColorSpace colorSpace) CF_SWIFT_NAME(getter:ColorSpace.stringValue(self:));

#endif /* SCKColorSpace_h */
