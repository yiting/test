//
//  BCPerformanceTimer.h
//  BCFoundation
//
//  Created by Sam Deane on 10/02/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//

#import <Foundation/Foundation.h>


/**
 An opaque type representing a point in time.
 The actual value is platform and implementation dependent.
 */

typedef uint64_t BCTime;


/**
 An opaque type representing an amount of time.
 The actual value is platform and implementation dependent.
 */

typedef uint64_t BCDuration;


/**
 Must be called at least once before doing any timing.
 It's safe to call multiple times, but only the first time will actually do anything.
 */

extern void BCPerformanceTimingInitialise(void);

/**
 Returns the time right now.
 Implemented to have low enough latency and high enough accuracy to be used for performance measurement.
 */

extern BCTime BCTimeNow(void);

/**
 Returns the duration between the start and finish times, which should both have been obtained from BCTimeNow();
 Implemented to have low enough latency and high enough accuracy to be used for performance measurement.

 You can convert this into a time interval using BCTimeIntervalsForDuration() see below.
 */

extern BCDuration BCDurationBetween(BCTime start, BCTime finish);

/**
 Returns the duration since a time previous obtained from BCTimeNow(). 
 This is the equivalent of calling BCDurationBetween(BCTimeNow(), time).
 Implemented to have low enough latency and high enough accuracy to be used for performance measurement.

 You can convert this into a time interval using BCTimeIntervalsForDuration() see below.
 */

extern BCDuration BCDurationSince(BCTime time);

/**
 Converts the duration into seconds and returns it as an NSTimeInterval.

 If you're timing a single event, you can pass the result of a BCDurationSince() call straight into
 this function to get it back as an NSTimeInterval.

 If you're timing a series of events however, it's most efficient to accumulate the total as a BCDuration
 value, and then convert the total once at the end, e.g:

     BCDuration total = 0;
     for (int n 0; n < 100; ++n) {
       BCTime start = BCTimeNow();
       do_some_thing();
       total += BCDurationSince(start);
     }
     return BCTimeIntervalsForDuration(total);

 With this approach, only a single conversion takes place, at the end.
 */

extern NSTimeInterval BCTimeIntervalsForDuration(BCDuration duration);



@interface BCPerformanceTimer : NSObject

@end
