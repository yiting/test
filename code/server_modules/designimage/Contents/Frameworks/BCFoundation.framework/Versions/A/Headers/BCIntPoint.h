//
//  Created by Aurimas Gasiulis on 27/02/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.
//

typedef struct {
  int32_t x;
  int32_t y;
} BCIntPoint;

/**
 Create int point with given x and y values.
 */
static inline BCIntPoint BCMakeIntPoint(int32_t x, int32_t y) {
  const BCIntPoint p = {
    x, y
  };

  return p;
}

/**
 Returns YES if both points have exactly the same x and y values.
 */
static inline BOOL BCIntPointsEqual(BCIntPoint a, BCIntPoint b) {
  return a.x == b.x && a.y == b.y;
}

typedef struct {
  int32_t count;
  BCIntPoint points[1];
} BCIntPointArray;

/**
 Creates int point array with a given amount of points allocated. Points are
 initialized to have zero for x and y values before returning.
 */
static inline BCIntPointArray *BCIntPointArrayCreate(int32_t count) {
  if (count < 1) {
    return NULL;
  }

  const size_t size = sizeof(BCIntPoint) * (count - 1);
  const size_t memorySize = size + sizeof(BCIntPointArray);

  BCIntPointArray *array = (BCIntPointArray *)malloc(memorySize);

  memset(array, 0, memorySize);

  array->count = count;

  return array;
}

/**
 Deallocates any memory allocated for int point array.
 */
static inline void BCIntPointArrayDestroy(BCIntPointArray *array) {
  free(array);
}
