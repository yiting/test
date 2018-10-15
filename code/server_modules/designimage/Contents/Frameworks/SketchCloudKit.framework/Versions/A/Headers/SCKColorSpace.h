//
//  SCKColorSpace.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 14-11-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

@import Foundation;

#ifndef SCKColorSpace_h
#define SCKColorSpace_h

typedef NS_ENUM(NSUInteger, SCKColorSpace) {
    SCKColorSpaceUnmanaged = 0,
    SCKColorSpaceSRGB = 1,
    SCKColorSpaceDisplayP3 = 2
};

SCKColorSpace SCKColorSpaceFromString(NSString * _Nullable string);
NSString * _Nullable SCKColorSpaceGetString(SCKColorSpace colorSpace);

#endif /* SCKColorSpace_h */
