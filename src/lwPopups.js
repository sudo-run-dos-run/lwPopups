/*!
 * Author: Tobias Weigl
 * http://www.tobias-weigl.de
 *
 * This source code is free to use under the CC0 license.
 */

/*!
 * Hint: We use the Revealing Module Pattern to organize the namespace.
 */

 /*!
 * WARNING: This software is a demo, the code is still evolving. It should not be used in commercial environments, yet.
 */

/*jslint browser: true, devel: true, sloppy: true, vars: true, nomen:true, todo:true*/
/*global $, tobias_weigl_de*/

/**
 * The lwPopups Core Module. lwPopups Is A Lightweight HTML5 Window Manager.
 *
 * @module lwPopups
 */
var lwPopups,
    lwPopups = lwPopups || {};


/**
 * The lwPopups Core Namespace.
 *
 * @namespace lwPopups
 */
lwPopups = (function () {

    var _thisPopUps = this;

    /**
     * Enum to define the position for the popup to appear at.
     *
     * @memberOf lwPopups
     * @readonly
     * @enum {number} Position Values to define the window position on pop up
     */
    var Position = {
        /** Positions window at previous window's position. Behaves like Position.CENTER for the first opened window. */
        PREVIOUS_POSITION : 0,
        /** Positions window at the center of the browser viewport. */
        CENTER : 1,
        /** Positions window at the left top of the browser viewport. */
        LEFT_TOP: 2,
        /** Positions window at the center top of the browser viewport. */
        CENTER_TOP: 3
    };

    var DefaultValuesMap = {
        DEFAULT_WINDOW_TITLE : "Info",
        DEFAULT_WINDOW_TEXT : "No details available.",
        DEFAULT_IMAGE_URL : "lwPopups_logo.png",
	DEFAULT_TEXT_COLOR : "white"
    };

    // CONFIG
    var ALLOW_UNLIMITED_WINDOWS = false;
    var IF_FALSE_ALLOW_UNLIMITED_WINDOWS_THEN_MAX_OPEN_WINDOWS = 10;
    /**
     *(CURRENTLY INACTIVE)
     *
     * @memberOf lwPopups
     * @readonly
     * @default
     * @property {string} CALL_CLASS Elements with this CSS class will have a keyboard event listener registered.
     *
     */
    var CALL_CLASS = 'lwPopupsCall';
    // === PRIVATE
    var FADING_DURATION_MS = 250;
    var DEFAULT_WINDOW_WIDTH_PX = 350;
    var LEFT_TOP__MARGIN_TOP_PX = 25;
    var LEFT_TOP__MARGIN_LEFT_PX = 50;
    var CENTER_TOP__MARGIN_TOP_PX = 120;
    var MAX_TEXT_LENGTH_BEFORE_RESCALE = 200;
    var MAX_WINDOW_WIDTH_PX = 750;
    var DEFAULT_POSITION = Position.CENTER;
    var ADDITIONAL_TITLE_BAR_TEXT = '';
    var ICON_IMG_PATH = 'resources/';
    var ERROR_SHAKE_DISTANCE = 3;
    var ERROR_SHAKE_TIMES = 3;
    // /CONFIG

    // TODO windowManager should hold those
    // TODO strange naming convention for those?!
    var WPOPUPS_GLOBAL_focus_id;
    var WPOPUPS_GLOBAL_id = 0;
    var WPOPUPS_GLOBAL_openWindows = 0;
    // TODO this is ridiculous - is there no better way?
    var WPOPUPS_GLOBAL_focus_level = 100000;
    var WPOPUPS_GLOBAL_focus_change_is_blocked = false;
    var WPOPUPS_GLOBAL_forbidMoreInstancesUntilClosed = false;
    var WPOPUPS_GLOBAL_last_window_position_point_2D = [];
    var WPOPUPS_GLOBAL_windowIsOpenedForTheFirstTime = true;
    var windowManager;

    function _viewPortHeight() {return $(window).height(); }
    function _viewPortWidth() {return $(window).width(); }

   /**
    * Getter/Setter. Configure or query if multiple windows can be opened.
    *
    * @memberOf lwPopups
    * @method allowUnlimitedWindows
    * @param {boolean=} b The boolean value to set. If not present in the call, the method behaves like a getter.
    * @return The current value or the value that has been set.
    */
    function allowUnlimitedWindows(b) {
        /**
         * Description
         *
         */
        function set(b) {
            if (b === true || b === false) {
                ALLOW_UNLIMITED_WINDOWS = b;
                return ALLOW_UNLIMITED_WINDOWS;
            }
            return undefined;
        }
        return b === undefined ? ALLOW_UNLIMITED_WINDOWS : set(b);
    }

   /**
    * Retrieve information about the current focus state.
    *
    * @memberOf lwPopups
    * @method getCurrentFocusID
    * @return Returns the ID of the currently focussed window or undefined if no window is currently focussed.
    */
    function getCurrentFocusID() {
        return WPOPUPS_GLOBAL_focus_id;
    }

    /**
     * Abstract Base Window Class.
     *
     * @private
     * @abstract
     * @class AbstractBaseWindow
     */
    var AbstractBaseWindow = function () { return undefined; };

    AbstractBaseWindow.prototype = {

        injectIntoDOM : function () {

            var id = this.id;
            var _this = this;

            WPOPUPS_GLOBAL_focus_level += 1;
            $('#popUpContainer').append('<div id="popUp-' + id + '" style="display:none;position:relative;z-index:' + WPOPUPS_GLOBAL_focus_level + '">');
            $('#popUp-' + id).append('<div id="popUpDraggable-' + id + '" style="position:fixed;opacity:inherit;user-drag:none;-webkit-user-drag:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-o-user-select:none;user-select:none"></div>');
            $('#popUpDraggable-' + id).append('<div id="popUpInnerContainer-' + id + '" style="position:relative;width:' + DEFAULT_WINDOW_WIDTH_PX + 'px;box-shadow: 2px 2px 6px 0px #999,inset 1px 1px 5px 2px #000;padding: 1px 1px 1px 1px"></div>');
            $('#popUpInnerContainer-' + id).append('<div id="popUpTitleBar-' + id + '" style="position:relative;color: #BBB;background: rgba(50, 50, 50, 0.8);padding: 2px 0 0 0;text-shadow: 1px 1px 1px #333;cursor:default"></div>');
            $('#popUpTitleBar-' + id).append('<img id="popUpTitleLogo-' + id + '" src="' + ICON_IMG_PATH + 'info.png" style="position:relative;top:-1px;margin:0 3px -4px 4px" alt />');
            $('#popUpTitleBar-' + id).append('<span id="popUpTitle-' + id + '" style="font-weight:bold;"></span>');
            $('#popUpTitleBar-' + id).append('<span id="popUpTitleBarText-' + id + '" style="padding-left: 4px">' + ADDITIONAL_TITLE_BAR_TEXT + '</span>');
            $('#popUpTitleBar-' + id).append('<span id="popUpTitleClose-' + id + '" style="float:right"><img id="popUpButtonX-' + id + '" style="margin:-3px -1px 3px -1px" alt="" /></span>');
            $('#popUpInnerContainer-' + id).append('<div id="popUpBody-' + id + '" style="position:relative;background: rgba(045, 045, 045, 0.92);cursor:default">');
            $('#popUpBody-' + id).append('<div id="popUpBodyContainer-' + id + '" style="position:relative;padding:4px 4px 3px 4px">');
            $('#popUpBodyContainer-' + id).append('<div id="popUpBodyContainerContentContainer-' + id + '" style="background: rgba(30,30,30,1);padding: 2px 4px 2px 4px;box-shadow: 0px 0px 0px 1px #333">');
            $('#popUpBodyContainerContentContainer-' + id).append('<div id="popUpContent-' + id + '" style="position:relative"></div>');

            // Prepare window for OS like look and feel

            $('#popUpDraggable-' + id).draggable({
                handle: "#popUpTitleBar-" + id
            }).draggable({
                cancel: "#popUpButtonX-" + id
            }).draggable(
                {
                    stop: function () {
                        _this.updatePositionScalars();
                        WPOPUPS_GLOBAL_last_window_position_point_2D[0] = Number($('#popUpDraggable-' + id).css('left').replace('px', ''));
                        WPOPUPS_GLOBAL_last_window_position_point_2D[1] = Number($('#popUpDraggable-' + id).css('top').replace('px', ''));
                        return undefined;
                    }
                }
            );

            $('#popUpButtonX-' + id).on('dragstart', function (event) {
                if (event !== undefined) {
                    event.preventDefault();
                }
            });

            $('#popUpDraggable-' + id).mousedown(function () {
                WPOPUPS_GLOBAL_focus_change_is_blocked = true;
                $("[id^=popUpTitleBar-]").css('background', 'rgba(90, 90, 90, 0.8)');
                WPOPUPS_GLOBAL_focus_id = id;
                $('#popUpTitleBar-' + id).css('background', 'rgba(70, 70, 70, 0.8)');
                WPOPUPS_GLOBAL_focus_level += 1;
                $('#popUp-' + id).css("z-index", WPOPUPS_GLOBAL_focus_level);
                $("[id^=popUp-]").css('opacity', '1');
                $('.popUpFocusMask').css('display', 'inline-block');
                if (event !== undefined) {
                    event.preventDefault();
                }
            });

            $('#popUpDraggable-' + id).mouseup(function () {
                WPOPUPS_GLOBAL_focus_change_is_blocked = false;
                $('.popUpFocusMask').css('display', 'none');
            });

            $(window).resize(function () {
                _this.autoReposition();
            });

            $('#popUpTitle-' + id).text(this.windowTitle);

            $('#popUpTitleLogo-' + id).attr("src", ICON_IMG_PATH + 'info.png');

            return undefined;
        },

        /**
         * Inject the content for a specific window kind. The hook is '$('#popUpContent-' + id)'.
         *
         * @memberOf AbstractBaseWindow
         * @private
         * @abstract
         * @method setContent
         * @param {string} content The content to be injected.
         * @throws lwPopups.error.AbstractFunctionNotImplementedError If there is no implementation, this method throws and error.
         */
        setContent : function (content) {
            this.devNull = content;
            throw new lwPopups.error.AbstractFunctionNotImplementedError("setContent(content) is not implemented!");
        },

        /**
         * Automatic scaling based on the window content type. E.g., for text it might be #chars, for frames width/height props, etc.
         *
         * @memberOf AbstractBaseWindow
         * @private
         * @abstract
         * @method autoscale
         * @throws lwPopups.error.AbstractFunctionNotImplementedError If there is no implementation, this method throws and error.
         */
        autoscale : function () {
            throw new lwPopups.error.AbstractFunctionNotImplementedError("autoscale() is not implemented!");
        },

        periodicWindowTitleUpdate : function (displayDuration_sec) {
            var _this = this;

            var updateRate_sec = 0.1;
            var _displayDuration_sec = displayDuration_sec === undefined ? this.displayDuration_sec : displayDuration_sec;
            $('#popUpTitle-' + this.id).text(this.windowTitle + ' (' + Math.floor(_displayDuration_sec) + ')');
            if (_displayDuration_sec >= updateRate_sec) {
                _displayDuration_sec -= updateRate_sec;
                _this.periodicWindowTitleUpdateTimeoutHandle = setTimeout(function () {_this.periodicWindowTitleUpdate(_displayDuration_sec); }, updateRate_sec * 1000);
            }
            return undefined;
        },

        updatePositionScalars : function () {
            var id = this.id;

            var borderOffset = 2;
            this.windowCenterRatioX = (Number($('#popUpDraggable-' + id).css('left').replace('px', '')) + $('#popUpDraggable-' + id).width() * 0.5) / (_viewPortWidth() + borderOffset);
            this.windowCenterRatioY = (Number($('#popUpDraggable-' + id).css('top').replace('px', '')) + $('#popUpDraggable-' + id).height() * 0.5) / (_viewPortHeight());
            return undefined;
        },

        preventOverlap : function (positionPoint2D) {
            var OFFSET_PX = 8;
            // TODO this should rather iterate over a window queue managed in windowManager
            $.each($("[id^=popUpDraggable-]"), function () {
                var overlapRangeX = Math.abs(positionPoint2D[0] - Number($(this).css('left').replace('px', '')));
                var overlapRangeY = Math.abs(positionPoint2D[1] - Number($(this).css('top').replace('px', '')));
                // TODO double-check me
                if (overlapRangeX < OFFSET_PX && overlapRangeY < OFFSET_PX) {
                    positionPoint2D[0] += OFFSET_PX + overlapRangeX;
                    positionPoint2D[1] += OFFSET_PX + overlapRangeY;
                }
            });

            return positionPoint2D;
        },

        autoposition : function () {
            var id = this.id;
            var position = this.position;

            var top, left;
            var positionPoint2D = [];

            if (!tobias_weigl_de.utilities.associative_array.contains(Position, position)) {
                position = DEFAULT_POSITION;
            }
            if (position === Position.PREVIOUS_POSITION && WPOPUPS_GLOBAL_windowIsOpenedForTheFirstTime) {
                position = DEFAULT_POSITION;
            }

            // HACK We need this, because "display:none"-styled divs have 0 size
            var opacity = $('#popUp-' + id).css('opacity');
            $('#popUp-' + id).css('opacity', '0.0001');
            $('#popUp-' + id).show();

            switch (position) {
            case Position.PREVIOUS_POSITION:
                left = WPOPUPS_GLOBAL_last_window_position_point_2D[0];
                top = WPOPUPS_GLOBAL_last_window_position_point_2D[1];
                break;
            case Position.CENTER:
                left = _viewPortWidth() * 0.5 - $('#popUpInnerContainer-' + id).width() * 0.5;
                top = _viewPortHeight() * 0.5 - $('#popUpInnerContainer-' + id).height() * 0.5;
                break;
            case Position.LEFT_TOP:
                left = LEFT_TOP__MARGIN_LEFT_PX;
                top = LEFT_TOP__MARGIN_TOP_PX;
                break;
            case Position.CENTER_TOP:
                left = _viewPortWidth() * 0.5 - $('#popUpInnerContainer-' + id).width() * 0.5;
                top = CENTER_TOP__MARGIN_TOP_PX;
                break;
            }

            positionPoint2D = this.preventOverlap([left, top]);

            $('#popUpDraggable-' + id).css('left', positionPoint2D[0]);
            $('#popUpDraggable-' + id).css('top', positionPoint2D[1]);

            this.updatePositionScalars();
            WPOPUPS_GLOBAL_last_window_position_point_2D = positionPoint2D;

            $('#popUp-' + id).hide();
            $('#popUp-' + id).css('opacity', opacity);

            return undefined;
        },

        autoReposition : function () {
            var id = this.id;

            if ($('#popUp-' + id).length !== 0) {
                var BORDER_MARGIN = 2;
                var SHADOW_MARGIN = 3;
                $('#popUpDraggable-' + id).css('left', this.windowCenterRatioX * (_viewPortWidth() + BORDER_MARGIN) - $('#popUpDraggable-' + id).width() * 0.5 + 'px');
                $('#popUpDraggable-' + id).css('top', this.windowCenterRatioY * (_viewPortHeight()) - $('#popUpDraggable-' + id).height() * 0.5 + 'px');

                // We always position the window so that it is completely visible if there is enough space
                if (Number($('#popUpDraggable-' + id).css('left').replace('px', '')) < 0) {
                    $('#popUpDraggable-' + id).css('left', '0px');
                }
                if (Number($('#popUpDraggable-' + id).css('top').replace('px', '')) < 0) {
                    $('#popUpDraggable-' + id).css('top', '0px');
                }
                if (Number($('#popUpDraggable-' + id).css('left').replace('px', '')) > _viewPortWidth() - $('#popUpDraggable-' + id).width() - SHADOW_MARGIN) {
                    $('#popUpDraggable-' + id).css('left', _viewPortWidth() - $('#popUpDraggable-' + id).width() - SHADOW_MARGIN + 'px');
                }
                if (Number($('#popUpDraggable-' + id).css('top').replace('px', '')) > _viewPortHeight() - $('#popUpDraggable-' + id).height() - SHADOW_MARGIN) {
                    $('#popUpDraggable-' + id).css('top', _viewPortHeight() - $('#popUpDraggable-' + id).height() - SHADOW_MARGIN + 'px');
                }

                // If there is not enough space we center it horizontally
                if (_viewPortWidth() <= $('#popUpDraggable-' + id).width()) {
                    $('#popUpDraggable-' + id).css('left', ((_viewPortWidth() * 0.5) - ($('#popUpInnerContainer-' + id).width() * 0.5)) + 'px');
                }
            }

            return undefined;
        },

        /**
         * Window "X"-Button.
         */
        buttonX : function (_this) {
            var id = _this.id;

            function setDefault() {
                $('#popUpButtonX-' + id).attr('src', ICON_IMG_PATH + 'buttonX.png');
                return undefined;
            }

            function init() {
                setDefault();
                $('#popUpButtonX-' + id).mousedown(function () {
                    _this.mouseDown = true;
                    $('#popUpButtonX-' + id).attr('src', ICON_IMG_PATH + 'buttonX-active.png');
                    return undefined;
                });

                $('#popUpButtonX-' + id).mouseenter(function () {
                    _this.mouseInside = true;
                    if (_this.mouseDown) {
                        $('#popUpButtonX-' + id).attr('src', ICON_IMG_PATH + 'buttonX-active.png');
                    } else {
                        $('#popUpButtonX-' + id).attr('src', ICON_IMG_PATH + 'buttonX-hover.png');
                    }
                    return undefined;
                });

                $('#popUpButtonX-' + id).mouseleave(function () {
                    _this.mouseInside = false;
                    setDefault();
                });
                return undefined;
            }

            return {
                setDefault : setDefault,
                init : init
            };
        },

        /**
         * Window "OK"-Button.
         */
        buttonOK : function (_this) {
            var id = _this.id;

            function setDefault() {
                $('#popUpButtonOK-' + id).css('background', 'rgba(50, 50, 50, 0.75)');
		$('#popUpButtonOK-' + id).css('color', '#BBB');
                $('#popUpButtonOK-' + id).css('box-shadow', '0px 0px 0px 1px #888, 1px 1px 1px 1px #333, inset 0px 5px 13px 1px #555');
                return undefined;
            }
            function setActive() {
                $('#popUpButtonOK-' + id).css('background', 'rgba(50, 50, 50, 0.97)');
                $('#popUpButtonOK-' + id).css('top', '1px');
                $('#popUpButtonOK-' + id).css('box-shadow', '0px 0px 0px 1px #999');
                return undefined;
            }
            function init() {
                if ($('#popUpButtons-' + id).length === 0) {
                    $('#popUpBodyContainer-' + id).append('<div id="popUpButtons-' + id + '" style="position:relative;width:76px;height:16px;margin:0 auto;padding-top:6px;text-align:center"></div>');
                }
                $('#popUpButtons-' + id).append('<div id="popUpButtonOK-' + id + '" style="height:14px;position:relative;font-weight:bold;text-shadow:#333 1px 1px 1px"></div>');
                $('#popUpButtonOK-' + id).append('<span style="font-size:small;bottom:0px;position:relative">OK</span>');
                setDefault();

                $('#popUpButtonOK-' + id).mousedown(function () {
                    _this.mouseDown = true;
                    setActive();
                    return undefined;
                });

                $('#popUpButtonOK-' + id).mouseenter(function () {
                    _this.mouseInside = true;
                    if (_this.mouseDown) {
                        setActive();
                    } else {
                        $('#popUpButtonOK-' + id).css('background', 'rgba(80, 80, 80, 0.97)');
                    }
                    return undefined;
                });

                $('#popUpButtonOK-' + id).mouseleave(function () {
                    _this.mouseInside = false;
                    setDefault();
                    return undefined;
                });
                return undefined;
            }

            return {
                setDefault : setDefault,
                setActive : setActive,
                init : init
            };
        },

        registerClickEventListeners : function () {
            var _this = this;
            var HARDCODED_LEFT_MOUSE_BUTTON = 1;

            $('body').mouseup(function (event) {
                if (_this.mouseDown) {
                    if (_this.mouseInside) {
                        if (event.which === HARDCODED_LEFT_MOUSE_BUTTON) {
                            _this.destroy();
                        }
                    }
                    _this.mouseDown = false;
                }
            });
            return undefined;
        },

        destroy : function () {
            var id = this.id;

            clearTimeout(this.periodicWindowTitleUpdateTimeoutHandle);
            clearTimeout(this.popUpInfoWindowTimeoutHandle);

            // TODO RefactorMe
            if (this.b1 !== undefined) {
                this.b1.setDefault();
            }
            if (this.b2 !== undefined) {
                this.b2.setDefault();
            }

            $('#popUp-' + id).css("transition", "");
            $('#popUp-' + id).fadeOut(FADING_DURATION_MS, function () {$('#popUp-' + id).remove(); });
            WPOPUPS_GLOBAL_openWindows -= 1;
            WPOPUPS_GLOBAL_focus_id = undefined;
            if (this.forbidMoreInstancesUntilClosed) {
                WPOPUPS_GLOBAL_forbidMoreInstancesUntilClosed = false;
            }
            return undefined;
        },

        show : function () {
            var _this = this;

            this.autoscale();
            this.autoposition();
            WPOPUPS_GLOBAL_focus_id = this.id;
            $('#popUp-' + this.id).fadeIn(this.FADING_DURATION_MS, function () {
                _this.registerClickEventListeners();
                $('#popUp-' + _this.id).css("transition", "0.1s ease-in-out");
            });
            this.windowIsOpen = true;
            WPOPUPS_GLOBAL_windowIsOpenedForTheFirstTime = false;
            return undefined;
        },

        autoDisappear : function (displayDuration_sec) {
            var _this = this;

            this.popUpInfoWindowTimeoutHandle = setTimeout(function () {
                _this.destroy();
            }, displayDuration_sec * 1000);
            return undefined;
        }
    };

    var TextWindow;

    /**
     * TextWindow Class.
     *
     * @private
     * @class TextWindow
     * @constructor
     * @param {number} id
     * @param {string} windowTitle
     * @param {string} windowText
     * @param {string} textColor
     * @param {number} position
     * @param {boolean} forbidMoreInstancesUntilClosed
     * @param {number} displayDuration_sec
     * @return undefined
     */
    TextWindow = function (id, windowTitle, windowText, textColor, position, forbidMoreInstancesUntilClosed, displayDuration_sec) {

        this.id = id;
        this.windowTitle = windowTitle === undefined ? DefaultValuesMap.DEFAULT_WINDOW_TITLE : windowTitle;
        this.windowText = windowText === undefined ? DefaultValuesMap.DEFAULT_WINDOW_TEXT : windowText;
        this.textColor = textColor === undefined ? DefaultValuesMap.DEFAULT_TEXT_COLOR : textColor;
	this.position = position === undefined ? DEFAULT_POSITION : position;
        this.forbidMoreInstancesUntilClosed = forbidMoreInstancesUntilClosed === undefined ? false : forbidMoreInstancesUntilClosed;

        // TODO RefactorMe
        if (displayDuration_sec !== undefined) {
            this.periodicWindowTitleUpdate(displayDuration_sec);
            this.autoDisappear(displayDuration_sec);
        }

        this.windowIsOpen = null;
        this.popUpInfoWindowTimeoutHandle = null;
        this.periodicWindowTitleUpdateTimeoutHandle = null;
        this.windowCenterRatioX = null;
        this.windowCenterRatioY = null;
        this.mouseDown = null;
        this.mouseInside = null;

        this.injectIntoDOM();

        this.b1 = new this.buttonX(this);
        this.b1.init();

        // TODO RefactorMe: should be configurable via config object
        // this simulates previous behaviour, where "popup window kinds" didn't have buttons
        // however, in succeeding releases this should no longer necessarily hold
        if (displayDuration_sec === undefined) {
            this.b2 = new this.buttonOK(this);
            this.b2.init();
        }

        WPOPUPS_GLOBAL_id += 1;
        WPOPUPS_GLOBAL_openWindows += 1;

        this.setContent = function () {
            $('#popUpContent-' + id).html(this.windowText);
	    $('#popUpContent-' + id).css('color', this.textColor);
        };

        this.setContent();

        this.autoscale = function () {
            var width = DEFAULT_WINDOW_WIDTH_PX;
            var weight = 0.75;
            var txtLength = $('#popUpContent-' + id).text().length;

            if (txtLength > MAX_TEXT_LENGTH_BEFORE_RESCALE) {
                width = DEFAULT_WINDOW_WIDTH_PX + Math.round(txtLength * weight);
                if (width > MAX_WINDOW_WIDTH_PX) {
                    width = MAX_WINDOW_WIDTH_PX;
                }
            }

            $('#popUpInnerContainer-' + id).css('width', width + 'px');

            return undefined;
        };

        this.show();

    };

    TextWindow.prototype = new AbstractBaseWindow();

    /**
     * Window Manager to Manage the Windows.
     *
     * @private
     * @namespace windowManager
     *
     */
    windowManager = (function () {

        var w;
        var windowQueue = [];

        /**
         * NO DESCRIPTION AVAILABLE YET
         *
         * @memberOf windowManager
         * @private
         * @method showText
         * @param {string} windowTitle
         * @param {string} windowText
         * @param {string} textColor
         * @param {number} position
         * @param {boolean} forbidMoreInstancesUntilClosed
         * @param {number=} [displayDuration_sec]
         * @return undefined
         */
        function showText(windowTitle, windowText, textColor, position, forbidMoreInstancesUntilClosed, displayDuration_sec) {
            if ((!ALLOW_UNLIMITED_WINDOWS && WPOPUPS_GLOBAL_openWindows >= IF_FALSE_ALLOW_UNLIMITED_WINDOWS_THEN_MAX_OPEN_WINDOWS) || WPOPUPS_GLOBAL_forbidMoreInstancesUntilClosed) {
                _thisPopUps.shakeAll();
            } else {
                WPOPUPS_GLOBAL_forbidMoreInstancesUntilClosed = forbidMoreInstancesUntilClosed;
                w = new TextWindow(WPOPUPS_GLOBAL_id, windowTitle, windowText, textColor, position, forbidMoreInstancesUntilClosed, displayDuration_sec);
                windowQueue.push(w);
            }
            return undefined;
        }

        return {
            showText : showText
        };
    }());


    /**
     * Shake all currently displayed windows.
     * 
     * @private
     * @method lwPopups.shakeAll
     */
    this.shakeAll = function () {
        if (!$("[id^=popUpDraggable]").is(":animated")) {
            $("[id^=popUpDraggable]").effect("shake", {distance: ERROR_SHAKE_DISTANCE, times: ERROR_SHAKE_TIMES});
        }

        return undefined;
    };

    /**
     * Shows a window that contains text.
     *
     * @method lwPopups.showText     
     * @param {string} [windowTitle="Info"] The Window Title.
     * @param {string} [windowText="No details available."] Text to display.
     * @param {string} [textColor="white"] The text color.
     * @param {number} [position=Position.CENTER] One of the values specified in Position.
     * @param {boolean} [forbidMoreInstancesUntilClosed=false] If true no more popups are created until this one is closed.
     * @param {number=} [displayDuration_sec] Duration until the window fades out automatically and is destroyed.
     * @return undefined
     */
    function showText(windowTitle, windowText, textColor, position, forbidMoreInstancesUntilClosed, displayDuration_sec) {
        windowManager.showText(windowTitle, windowText, textColor, position, forbidMoreInstancesUntilClosed, displayDuration_sec);
        return undefined;
    }



    /**
     * Constructs and injects the window container.
     */
    function constructAndInjectWindowContainer() {

        $('body').prepend('<div id="popUpContainer"></div>');

        // TODO where should this be?!? Clearly not here
        // REGISTER FOCUS HANDLING
        $(window).mousedown(function () {
            if (!WPOPUPS_GLOBAL_focus_change_is_blocked) {
                WPOPUPS_GLOBAL_focus_id = undefined;
                $("[id^=popUpTitleBar-]").css('background', 'rgba(50, 50, 50, 0.8)');
                $("[id^=popUp-]").css('opacity', '0.92');
            }
        });

        return undefined;
    }

    $(function () {
        constructAndInjectWindowContainer();
        return undefined;
    });

    return {
        // Config + Public Enums
        CALL_CLASS : CALL_CLASS,
        Position : Position,
        getCurrentFocusID : getCurrentFocusID,
        allowUnlimitedWindows : allowUnlimitedWindows,
        // Core Popup Window API
        showText : showText
    };
}());


lwPopups.error = (function () {
    function AbstractFunctionNotImplementedError(message) {
        this.name = "AbstractFunctionNotImplementedError";
        this.message = (message || "Abstract functions must be implemented!");
    }

    AbstractFunctionNotImplementedError.prototype = Error.prototype;

    return {
        AbstractFunctionNotImplementedError : AbstractFunctionNotImplementedError
    };
}());