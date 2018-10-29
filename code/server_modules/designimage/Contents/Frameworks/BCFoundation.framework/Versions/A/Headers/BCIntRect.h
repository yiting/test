//
//  Created by Aurimas Gasiulis on 27/02/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.
//

typedef struct {
  int32_t x;
  int32_t y;
  int32_t width;
  int32_t height;
} BCIntRect;

/**
 Creates int rect with given position and size.
 */
static inline BCIntRect BCMakeIntRect(int32_t x, int32_t y, int32_t width, int32_t height) {
  const BCIntRect r = {
    x, y, width, height
  };

  return r;
}

/**
 Returns YES if position and size of both rects is equal.
 */
static inline BOOL BCIntRectsEqual(BCIntRect a, BCIntRect b) {
  return a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height;
}

/**
 Returns YES if a given point is inside rect.
 */
static inline BOOL BCIntRectContains(BCIntRect rect, int32_t x, int32_t y) {
  return (x >= rect.x && x < (rect.x + rect.width) &&
    y >= rect.y && y < (rect.y + rect.height));
}

/**
 Returns YES if a given rect has zero width or zero height, or both size
 values are zero.
 */
static inline BOOL BCIntRectIsEmpty(BCIntRect rect) {
  return rect.width <= 0 || rect.height <= 0;
}

/**
 Returns YES if given rects intersects.
 */
static inline BOOL BCIntRectsIntersect(BCIntRect a, BCIntRect b) {
  return (a.x < (b.x + b.width) && b.x < (a.x + a.width) &&
    a.y < (b.y + b.height) && b.y < (a.y + a.height));
}

/**
 Returns YES if rect b is completely inside rect a.
 */
static inline BOOL BCIntRectContainsRect(BCIntRect a, BCIntRect b) {
  return (!BCIntRectIsEmpty(a) && !BCIntRectIsEmpty(b) &&
    a.x <= b.x && (a.x + a.width) >= (b.x + b.width) &&
    a.y <= b.y && (a.y + a.height) >= (b.y + b.height));
}

/**
 Creates int rect from NSRect. NSRect is first expanded to integer coordinates.
 For example, NSRect(0.3, 0.6, 5, 5) becomes BCIntRect(0, 0, 6, 6).
 */
static inline BCIntRect BCIntRectFromNSRectExpanded(NSRect rect) {
  const int32_t x = (int)floor(NSMinX(rect));
  const int32_t y = (int)floor(NSMinY(rect));

  const int32_t width = (int)ceil(NSMaxX(rect)) - x;
  const int32_t height = (int)ceil(NSMaxY(rect)) - y;

  return BCMakeIntRect(x, y, width, height);
}

/**
 Creates int rect from NSRect. Unlike MSIntRectFromNSRectExpanded which
 expands floating point coordinates of NSRect, this method rounds them.
 */
static inline BCIntRect BCIntRectFromNSRectRounded(NSRect rect) {
  const int32_t minx = (int)round(NSMinX(rect));
  const int32_t miny = (int)round(NSMinY(rect));

  const int32_t maxx = (int)round(NSMaxX(rect));
  const int32_t maxy = (int)round(NSMaxY(rect));

  return BCMakeIntRect(minx, miny, maxx - minx, maxy - miny);
}

/**
 Creates int rect from NSRect. NSRect is first resized to fit into smallest
 rectangle that can be described by using only integers.
 */
static inline BCIntRect BCIntRectFromNSRectReduced(NSRect rect) {
  const int32_t minx = (int)ceil(NSMinX(rect));
  const int32_t miny = (int)ceil(NSMinY(rect));

  const int32_t maxx = (int)floor(NSMaxX(rect));
  const int32_t maxy = (int)floor(NSMaxY(rect));

  return BCMakeIntRect(minx, miny, maxx - minx, maxy - miny);
}

/**
 Calculates intersection of two rects.
 */
static inline BCIntRect BCIntRectIntersection(BCIntRect a, BCIntRect b) {
  const int32_t minx = MAX(a.x, b.x);
  const int32_t miny = MAX(a.y, b.y);
  const int32_t maxx = MIN(a.x + a.width, b.x + b.width);
  const int32_t maxy = MIN(a.y + a.height, b.y + b.height);
  const int32_t x = maxx - minx;
  const int32_t y = maxy - miny;

  if (x <= 0 || y <= 0) {
    return BCMakeIntRect(0, 0, 0, 0);
  }

  return BCMakeIntRect(minx, miny, x, y);
}

/**
 Calculates union of two rectangles.
 */
static inline BCIntRect BCIntRectUnion(BCIntRect a, BCIntRect b) {
  const int32_t minx = MIN(a.x, b.x);
  const int32_t miny = MIN(a.y, b.y);
  const int32_t maxx = MAX(a.x + a.width, b.x + b.width);
  const int32_t maxy = MAX(a.y + a.height, b.y + b.height);
  return BCMakeIntRect(minx, miny, maxx - minx, maxy - miny);
}

/**
 Expand int rect so that edges of resulting rect is aligned to a given alignment.
 */
static inline BCIntRect BCAlignIntRect(BCIntRect rect, uint32_t alignment) {
  const uint32_t mask = alignment - 1;
  const uint32_t maskInverted = ~mask;

  const int32_t minx = rect.x & maskInverted;
  const int32_t miny = rect.y & maskInverted;
  const int32_t maxx = ((rect.x + rect.width) + mask) & maskInverted;
  const int32_t maxy = ((rect.y + rect.height) + mask) & maskInverted;

  return BCMakeIntRect(minx, miny, maxx - minx, maxy - miny);
}


typedef struct {
  uint32_t count;
  uint32_t capacity;
  BCIntRect *rects;
} BCIntRectArray;

/**
 Creates an empty int rect array. Memory is allocated for array itself, but
 no actual rects are allocated.
 */
static inline BCIntRectArray *BCIntRectArrayCreate() {
  BCIntRectArray *array = (BCIntRectArray *)malloc(sizeof(BCIntRectArray));
  array->count = 0;
  array->capacity = 0;
  array->rects = NULL;
  return array;
}

/**
 Deallocates memory allocated for rectangles inside of array and array itself.
 */
static inline void BCIntRectArrayDestroy(BCIntRectArray *array) {
  free(array->rects);
  free(array);
}

static inline void _BCIntRectArrayIncreaseCapacity(BCIntRectArray *array) {
  if (array->count >= array->capacity) {
    const uint32_t newCapacity = MAX(4U, array->capacity * 2);

    BCIntRect *newArray = malloc(sizeof(BCIntRect) * newCapacity);

    memcpy(newArray, array->rects, sizeof(BCIntRect) * array->count);
    free(array->rects);

    array->capacity = newCapacity;
    array->rects = newArray;
  }
}

/**
 Appends new rectangle at the end of array. Array is expanded if necessary
 before appending.
 */
static inline void BCIntRectArrayAppend(BCIntRectArray *array, BCIntRect rect) {
  _BCIntRectArrayIncreaseCapacity(array);

  array->rects[array->count++] = rect;
}

/**
 Insert new rect at a given position. Array is expanded if necessary before
 inserting.
 */
static inline void BCIntRectArrayInsert(BCIntRectArray *array, BCIntRect rect, uint32_t index) {
  if (index >= array->count || array->count < 1) {
    BCIntRectArrayAppend(array, rect);
  } else if (index == 0) {
    _BCIntRectArrayIncreaseCapacity(array);

    memmove(array->rects + 1, array->rects, sizeof(BCIntRect) * array->count);

    array->rects[0] = rect;
    array->count++;
  } else {
    // Insert in the middle.
    _BCIntRectArrayIncreaseCapacity(array);

    memmove(array->rects + index + 1, array->rects + index,
      sizeof(BCIntRect) * array->count - index);

    array->rects[index] = rect;
    array->count++;
  }
}

/**
 Returns YES if array contains at least one rectangle which has both width and
 height greater than zero.
 */
static inline BOOL BCIntRectArrayHasNonEmptyRects(const BCIntRectArray *array) {
  for (uint32_t i = 0; i < array->count; i++) {
    const BCIntRect r = array->rects[i];

    if (!BCIntRectIsEmpty(r)) {
      return YES;
    }
  }

  return NO;
}

static inline int BCIntRectSortComparator(const void *a, const void *b) {
  const BCIntRect *ar = (const BCIntRect *)a;
  const BCIntRect *br = (const BCIntRect *)b;
  const size_t areaA = ar->width * ar->height;
  const size_t areaB = br->width * br->height;

  if (areaA == areaB) {
    return 0;
  } else if (areaA < areaB) {
    return 1;
  }

  return -1;
}

/**
 Sorts a given rect array by area (width * height). After sort, largets rectangle
 will be at the beginning of this array.
 */
static inline void BCIntRectArraySortByArea(BCIntRectArray *array) {
  qsort(array->rects, array->count, sizeof(BCIntRect), BCIntRectSortComparator);
}
