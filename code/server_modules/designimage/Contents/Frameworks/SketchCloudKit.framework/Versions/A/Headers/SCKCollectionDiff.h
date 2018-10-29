//  Created by Robin Speijer on 06-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDiff.h"
@class SCKObject;
@class SCKArtboard;

@interface SCKCollectionDiff : NSObject <SCKDiff>

- (nonnull instancetype)initWithObject:(nonnull NSArray<SCKObject<SCKDiffable> *> *)object comparedTo:(nonnull NSArray<SCKObject<SCKDiffable> *> *)otherObject;
- (nonnull instancetype)initWithCollectionDiffSet:(nonnull NSSet<SCKCollectionDiff *> *)diffSet;

@property (nonatomic, nonnull, copy, readonly) NSArray<SCKObject<SCKDiffable> *> *object;
@property (nonatomic, nonnull, copy, readonly) NSArray<SCKObject<SCKDiffable> *> *comparedObject;

/// All insertions in the compared collection, relative to the initial collection.
@property (nonatomic, nullable, readonly) NSSet<SCKObject<SCKDiffable> *> *insertions;

/// All updates in the compared collection, relative to the initial collection. Those updates are represented by diffs, so that specific changes for those updates can be retreived.
@property (nonatomic, nullable, readonly) NSSet<id<SCKDiff>> *updateDiffs;

/// All items that were removed from the initial collection, relative to the compared collection.
@property (nonatomic, nullable, readonly) NSSet<SCKObject<SCKDiffable> *> *deletions;

@end
