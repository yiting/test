//
//  Created by Gavin MacLean on 03/05/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//
@import Compression;

/**
 Extends NSData to allow compression with Apple's compression libraries
 */
@interface NSData (AppleCompression)

/**
 Compresses the receiver's data using \c algorithm.
 As well as the compressed data, the returned NSData will have an extra 12 bytes pre-prended
 which contains the compression algorithm used (4 bytes) and the size of the orginal data (8 bytes).
 This can be used when uncompressing.
 
 Returns nil on failure
 */
- (nullable NSData*)dataByCompressingWithAlgorithm_bc:(compression_algorithm)algorithm;

/**
 Decompresses the receiver's data.
 The data is expected to have been previously compressed using dataByCompressingWithAlgorithm_bc
 and should therefore contain the compression algorithm and original data size in the first
 12 bytes.
 */
- (nullable NSData*)dataByDecompressing_bc;

@end
