//  Created by Robin Speijer on 13-06-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

typedef NS_OPTIONS(NSUInteger, SCKFileImageType) {
  SCKFileImageTypeFull = 0,
  SCKFileImageTypeScrollable = 1 << 0,
  SCKFileImageTypeFixed = 1 << 1
} NS_SWIFT_NAME(FileImageType);

SCKFileImageType SCKFileImageTypeForKey(NSString * _Nullable key) CF_SWIFT_NAME(FileImageType.init(stringValue:));
NSString * _Nonnull SCKFileImageTypeKeyForType(SCKFileImageType type) CF_SWIFT_NAME(getter:FileImageType.stringValue(self:));
