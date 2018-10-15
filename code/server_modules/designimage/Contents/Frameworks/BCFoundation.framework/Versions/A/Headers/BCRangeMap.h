//
//  BCRangeMap.h
//  BCFoundation
//
//  Created by Johnnie Walker on 14/12/2015.
//  Copyright © 2015 Bohemian Coding. All rights reserved.
//

/// BCRangeMap maps indexes in non-overlapping ranges to objects.
/// The current implementation does not check for overlapping ranges when objects are inserted
/// objects are stored with strong references.

@interface BCRangeMap : NSObject
- (NSSet *)allRanges;
- (NSSet *)allObjects;
- (id)objectForLocation:(NSUInteger)index;
- (NSRange)rangeForLocation:(NSUInteger)index;
- (void)setObject:(id <NSObject>)object forRange:(NSRange)range;
- (void)removeObjectsAtOrBeyondLocation:(NSUInteger)index;
@end
