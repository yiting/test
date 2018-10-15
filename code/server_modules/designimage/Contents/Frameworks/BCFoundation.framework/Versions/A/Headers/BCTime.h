//  Created by Sam Deane on 16/10/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

extern NSTimeInterval BCTimeRandomInterval(NSTimeInterval initialDelayInSeconds, NSTimeInterval rangeInSeconds);
extern int64_t BCTimeRandomDispatchTimeDelta(NSTimeInterval initialDelayInSeconds, NSTimeInterval rangeInSeconds);
extern dispatch_time_t BCTimeRandomDispatchDelay(NSTimeInterval initialDelayInSeconds, NSTimeInterval rangeInSeconds);
