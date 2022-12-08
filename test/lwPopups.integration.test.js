/*!
 * Author: Tobias Weigl
 * http://www.tobias-weigl.de
 *
 * This source code is free to use under the CC0 license.
 */

/*!
 * INTEGRATION TESTS
 */

describe("lwPopupsUtilities integration test cases", () => {
  it("lwPopupsUtilities-it-1: main popup container is injected", () => {
    // Running the lwPopups script automatically creates a new container under the html body
    expect($('body div[id^="popUpContainer"]').length).toEqual(1);
  }),
  it("lwPopupsUtilities-it-2: the text popup works", () => {
    // Creating a text popup with title and content  
    const titleText = "le title";
    const bodyText = "ohai!";
    lwPopups.showText(titleText, bodyText);
    expect($('span[id^="popUpTitle-"]').html()).toEqual(titleText);
    expect($('div[id^="popUpContent-"]').html()).toEqual(bodyText);
  })
});