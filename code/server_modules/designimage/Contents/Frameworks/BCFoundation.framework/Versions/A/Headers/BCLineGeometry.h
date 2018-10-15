// Created by Pieter Omvlee on 10/09/2012.
// Copyright Bohemian Coding

#import "BCGeometry.h"
#import "BCRectGeometry.h"

static inline BCLine BCLineMake(CGFloat position, BCAxis axis) {
  BCLine line;
  line.position = position;
  line.axis = axis;

  return line;
}

static inline BOOL GKLineSnapToPosition(BCLine line, CGFloat pos, CGFloat margin, CGFloat *snapped) {
  if (ABS(pos - line.position) < margin) {
    *snapped = pos;
    return YES;
  } else
    return NO;
}

static inline BOOL GKLineSnapsToRect(BCLine line, CGRect rect, CGFloat margin, CGFloat *snapped) {
  BCAxis axis = line.axis;
  if (GKLineSnapToPosition(line, BCRectMinForAxis(rect, axis), margin, snapped))
    return YES;
  else if (GKLineSnapToPosition(line, BCRectMaxForAxis(rect, axis), margin, snapped))
    return YES;
  else
    return NO;
}
