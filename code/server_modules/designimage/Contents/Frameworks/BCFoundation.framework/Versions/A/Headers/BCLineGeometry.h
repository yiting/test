// Created by Pieter Omvlee on 10/09/2012.
// Copyright Bohemian Coding

#import "BCGeometry.h"
#import "BCRectGeometry.h"


/**
 A simple structure defining a vertical or horizontal line. It occupies a position on \c axis
 (i.e. BCAxisX = a vertical line/edge, BCAxisY = a horizontal line/edge.) and extends infinitely
 from there.
 */
typedef struct {
  CGFloat position;
  BCAxis axis;
} BCOrthogonalLine;


static inline BCOrthogonalLine BCOrthogonalLineMake(CGFloat position, BCAxis axis) {
  BCOrthogonalLine line; line.position = position; line.axis = axis; return line;
}
