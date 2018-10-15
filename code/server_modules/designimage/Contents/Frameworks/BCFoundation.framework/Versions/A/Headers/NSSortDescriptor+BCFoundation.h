//  Created by Kevin Meaney on 04/04/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

#import <Foundation/Foundation.h>

@interface NSSortDescriptor (BCFoundation)

/// Create a sort descriptor sorting on strings using a case insensitive sort.
+ (nonnull instancetype)localizedCaseInsensitiveSortDescriptorWithKey:(nullable NSString *)key ascending:(BOOL)ascending;
@end
