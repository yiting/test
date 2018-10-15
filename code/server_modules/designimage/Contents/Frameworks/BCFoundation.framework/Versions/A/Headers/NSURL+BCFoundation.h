//  Created by Gavin on 23/08/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.

@interface NSURL (BCFoundation)

/**
 Returns a URL with any period stripped off the beginning of the file name.
 This method can be used to ensure that any file we're dealing with is not hidden.
 */
- (NSURL*)URLByStrippingInvisiblePeriod_bc;

/**
 Treats any "/" characters in a layer name as path separators, but escapes any other characters that might cause the file system trouble.
 If there are multiple "/" characters in a row, they would be interpreted as empty folder paths - instead we just ignore them.
 If the layer name was entirely composed of slashes, nothing would be added to the input URL - in this case we add the default name.
 */
- (NSURL*)URLByAppendingNameWithSeparators:(NSString*)name defaultName:(NSString *)defaultName;

/**
 Does the URL have the given extension?
 Note this does a case-insensitive comparison of the URL's pathExtension with the given argument.
 */
- (BOOL)hasExtension:(NSString *)extension;

- (NSURL *)withExtension:(NSString *)extension;

- (NSURL *)URLByResolvingSymlinksAndAliases;

/// Are the receiver url and the method argument both file urls and both refer to the same location.
- (BOOL)isEqualToFileURL_bc:(NSURL *)otherURL;

@property (nonatomic,readonly) BOOL isInTrash_bc;

@end
