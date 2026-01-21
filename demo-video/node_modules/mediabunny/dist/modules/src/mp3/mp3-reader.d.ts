/*!
 * Copyright (c) 2025-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { FrameHeader } from '../../shared/mp3-misc.js';
import { Reader } from '../reader.js';
export declare const readNextFrameHeader: (reader: Reader, startPos: number, until: number | null) => Promise<{
    header: FrameHeader;
    startPos: number;
} | null>;
//# sourceMappingURL=mp3-reader.d.ts.map