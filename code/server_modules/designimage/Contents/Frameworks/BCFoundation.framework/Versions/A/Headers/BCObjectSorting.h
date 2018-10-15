//  Created by Pieter Omvlee on 05/08/2014.
//  Copyright (c) 2014 Bohemian Coding. All rights reserved.

extern NSString * const BCSortableKeyName;
extern NSString * const BCSortableKeyContents;
extern NSString * const BCSortableKeyChildren;

@protocol BCSortable <NSObject>
@property (nonatomic, readonly) NSString *name;
@end

/**
 This is a class that helps you sort an unordered array of named objects (for instance symbols / shared objects).
 The result of this sorting is an array of dictionaries, each dictionary having two entries; BCSortableKeyName
 and either BCSortableKeyChildren or BCSortableKeyContents.
 The value under BCSortableKeyName is the name of the sorted item.
 If a value is stored under BCSortableKeyChildren this is another array of dictionaries with the same format.
 Otherwise the value stored under BCSortableKeyContents is one of the sortable objects.
 */
@interface BCObjectSorting : NSObject

/**
 Returns an array of dictionaries guartanteed to be sorted in alphabetical order, but with no nesting.
 */
+ (NSArray <NSDictionary *> *)sortObjectsAlphabetically:(NSArray <id<BCSortable>> *)sortableObjects;

/**
 Returns an array of dictionaries guartanteed to be both alphabetical order and nested.
 The hierarchy is decided upon by the name of the object, similar to how filenames work:
 If we have two objects named "A/B" and "A/C" they should both appear as B and C in a group named A.
 In the above example the first object would be a \c dictionary named "A" with as its contents an array
 of two more \c dictionaries titled B and C containing those objects.
 */
+ (NSArray <NSDictionary *> *)sortObjectsWithNesting:(NSArray <id<BCSortable>> *)sortableObjects;

/**
 Returns an array of dictionaries guartanteed to be both alphabetical order and nested.
 Unlike \c sortObjectsWithNesting: this method compresses any groups which contain one item so instead of A > B > C > D
 we'd get A/B/C > D.
 */
+ (NSArray <NSDictionary *> *)sortObjectsWithCompressedNesting:(NSArray <id<BCSortable>> *)sortableObjects;


@end
