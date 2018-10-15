//
//  NSDate+BCFoundation.h
//  BCFoundation
//
//  Created by Sam Deane on 30/01/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDate(BCFoundation)

/**
 Return a date formatter which can output ISO8601 dates.
 
 @discussion Note that:
              - macOS 10.12 helpfully introduces NSISO8601DateFormatter, which will make this obsolete; but we can't use it yet because we're still supporting 10.11.
              - currently this implementation only supports converting from NSDate to NSString; we could add the alternate route if we need it.
 */

+ (NSDateFormatter*)iso8601DateFormatter;

/**
 Return this date as an iso8601 formatter.
 
 @discussion  This makes a new formatter every time. For the sake of efficiency, if you're going to
              convert lots of dates, it's better to get a formatter object yourself and use it.
 */

- (NSString*)iso8601;
@end
