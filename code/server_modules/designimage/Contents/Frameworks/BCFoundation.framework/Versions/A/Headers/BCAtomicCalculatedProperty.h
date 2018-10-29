//  Created by Johnnie Walker on 20/06/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#ifndef BCAtomicCalculatedProperty_h
#define BCAtomicCalculatedProperty_h

#import <stdatomic.h>

/*

 BCAtomicCalculatedObject & BCAtomicCalculatedCType are macros which provide the method body
 for lazily calculated, atomic properties.

 For example, an immutable class might declare a `bounds` property, which is expensive to
 compute, and may not be needed for all instances of the class. We would like the property
 to be:

 * Not calculated at all if it's never accessed
 * Calculated exactly once per instance
 * Atomic - so that multiple threads / queues accessing the property at the same time do not
            cause data races or collisions

 This is done using the C11 atomic operations on pointers.

 In the above example, a class would declare an instance variable as storage for the bounds
 property. In addition, we also need an atomic pointer. Initially the value of the atomic
 pointer is NULL. After the property has been calculated, the atomic pointer points to the
 class's instance variable. As long as the calculated property is acesssed via the atomic
 pointer, it is safe to access from multiple threads.

 Note that for objects with weak storage, the object will not be recalculated after being
 nullified. In this case the returned value from `BCAtomicCalculatedObject()` will be `nil`

 Typical use of these macros:

 ```
 @interface Layer: NSObject
 @property (nonatomic, readonly) CGRect bounds;
 @property (nonatomic, readonly) id image;
 @end

 @implementation Layer {
    // bounds struct
    CGRect _bounds;
    void * _Atomic _boundsAtomicPointer;

    // image object
    id _image;
    void * _Atomic _imageAtomicPointer;
 }

 - (CGRect)calculateBounds {
 // Expensive calculations
 return CGRectZero;
 }

 - (CGRect)bounds {
   return BCAtomicCalculatedCType(CGRect, _boundsAtomicPointer, _bounds, self, ^{return [self calculateBounds];});
 }

 - (id)calculateImage {
    return [NSImage new];
 }

 - (id)image {
    return BCAtomicCalculatedObject(_imageAtomicPointer, _image, self, ^{return [self calculateImage];});
 }

 @end

 ```

 */

#define _BCAtomicCalculatedCommon(atomicPointer, nonatomicPointer, atomicity, creatorBlock)   \
  if (pointer == NULL) {                                                                      \
    NSParameterAssert(atomicity);                                                             \
    @synchronized(atomicity) {                                                                \
      pointer = atomic_load(&atomicPointer);                                                  \
      if (pointer == NULL) {                                                                  \
        nonatomicPointer = creatorBlock();                                                    \
        pointer = (void *) &nonatomicPointer;                                                 \
        atomic_store(&atomicPointer, pointer);                                                \
      }                                                                                       \
    }                                                                                         \
  }

#define BCAtomicCalculatedObject(atomicPointer, nonatomicPointer, atomicity, creatorBlock) ({ \
    void **pointer = atomic_load(&atomicPointer);                                             \
    _BCAtomicCalculatedCommon(atomicPointer, nonatomicPointer, atomicity, creatorBlock)       \
    (__bridge id) *pointer;                                                                   \
})

#define BCAtomicCalculatedCType(type, atomicPointer, nonatomicPointer, atomicity, creatorBlock) ({ \
  void* pointer = atomic_load(&atomicPointer);                                                \
  _BCAtomicCalculatedCommon(atomicPointer, nonatomicPointer, atomicity, creatorBlock)         \
  *(type *)pointer;                                                                           \
})

#define BCAtomicHasCalculatedObject(atomicPointer) (atomic_load(&atomicPointer) == NULL?NO:YES)

#endif /* BCAtomicCalculatedProperty_h */
