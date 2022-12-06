/*!
 * Author: Tobias Weigl
 * http://www.tobias-weigl.de
 *
 * This source code is free to use under the CC0 license.
 */

/*!
 * UNIT TESTS
 */

describe("lwPopupsUtilities unit test cases", () => {
  it("lwPopupsUtilities-ut-1: array of strings contains a string, type sensitive", () => {
    var b = tobias_weigl_de.utilities.associative_array.contains(["0", "1", "2", "3"], "2");
    expect(b).toBe(true);
  }),
  it("lwPopupsUtilities-ut-2: array of strings misses a string, type sensitive", () => {
    var b = tobias_weigl_de.utilities.associative_array.contains(["0", "1", "2", "3"], "4");
    expect(b).toBe(false);
  });
});
