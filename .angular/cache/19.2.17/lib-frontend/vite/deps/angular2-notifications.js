import {
  animate,
  sequence,
  state,
  style,
  transition,
  trigger
} from "./chunk-TZLKYN5K.js";
import {
  DomSanitizer
} from "./chunk-AHZXY52I.js";
import "./chunk-YT36VPMT.js";
import "./chunk-GUVN4Q56.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-22H2PGKP.js";
import {
  DOCUMENT
} from "./chunk-E5CD2VNR.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Output,
  RendererFactory2,
  RuntimeError,
  TemplateRef,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction8,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor
} from "./chunk-LLRKTISV.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import {
  Subject
} from "./chunk-4S3KYZTJ.js";
import {
  __spreadValues
} from "./chunk-TXDUYLVM.js";

// node_modules/@angular/animations/fesm2022/animations.mjs
var AnimationBuilder = class _AnimationBuilder {
  static ɵfac = function AnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnimationBuilder)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AnimationBuilder,
    factory: () => (() => inject(BrowserAnimationBuilder))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(BrowserAnimationBuilder)
    }]
  }], null, null);
})();
var AnimationFactory = class {
};
var BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
  animationModuleType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _nextAnimationId = 0;
  _renderer;
  constructor(rootRenderer, doc) {
    super();
    const typeData = {
      id: "0",
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {
        animation: []
      }
    };
    this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
      throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
    }
  }
  build(animation2) {
    const id = this._nextAnimationId;
    this._nextAnimationId++;
    const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
    issueAnimationCommand(this._renderer, null, id, "register", [entry]);
    return new BrowserAnimationFactory(id, this._renderer);
  }
  static ɵfac = function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationBuilder)(ɵɵinject(RendererFactory2), ɵɵinject(DOCUMENT));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BrowserAnimationBuilder,
    factory: _BrowserAnimationBuilder.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var BrowserAnimationFactory = class extends AnimationFactory {
  _id;
  _renderer;
  constructor(_id, _renderer) {
    super();
    this._id = _id;
    this._renderer = _renderer;
  }
  create(element, options) {
    return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
  }
};
var RendererAnimationPlayer = class {
  id;
  element;
  _renderer;
  parentPlayer = null;
  _started = false;
  constructor(id, element, options, _renderer) {
    this.id = id;
    this.element = element;
    this._renderer = _renderer;
    this._command("create", options);
  }
  _listen(eventName, callback) {
    return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
  }
  _command(command, ...args) {
    issueAnimationCommand(this._renderer, this.element, this.id, command, args);
  }
  onDone(fn) {
    this._listen("done", fn);
  }
  onStart(fn) {
    this._listen("start", fn);
  }
  onDestroy(fn) {
    this._listen("destroy", fn);
  }
  init() {
    this._command("init");
  }
  hasStarted() {
    return this._started;
  }
  play() {
    this._command("play");
    this._started = true;
  }
  pause() {
    this._command("pause");
  }
  restart() {
    this._command("restart");
  }
  finish() {
    this._command("finish");
  }
  destroy() {
    this._command("destroy");
  }
  reset() {
    this._command("reset");
    this._started = false;
  }
  setPosition(p) {
    this._command("setPosition", p);
  }
  getPosition() {
    return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
  }
  totalTime = 0;
};
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
function isAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  return type === 0 || type === 1;
}

// node_modules/angular2-notifications/fesm2022/angular2-notifications.mjs
var _c0 = (a0, a1, a2, a3, a4, a5, a6, a7) => ({
  "alert": a0,
  "error": a1,
  "warn": a2,
  "success": a3,
  "info": a4,
  "bare": a5,
  "rtl-mode": a6,
  "has-icon": a7
});
var _c1 = (a0) => ({
  "width": a0
});
function NotificationComponent_div_1_div_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NotificationComponent_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 9);
    ɵɵtemplate(1, NotificationComponent_div_1_div_1_ng_container_1_Template, 1, 0, "ng-container", 10);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.title)("ngTemplateOutletContext", ctx_r0.item.context);
  }
}
function NotificationComponent_div_1_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 11);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("innerHTML", ctx_r0.title, ɵɵsanitizeHtml);
  }
}
function NotificationComponent_div_1_div_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NotificationComponent_div_1_div_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 12);
    ɵɵtemplate(1, NotificationComponent_div_1_div_4_ng_container_1_Template, 1, 0, "ng-container", 10);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.content)("ngTemplateOutletContext", ctx_r0.item.context);
  }
}
function NotificationComponent_div_1_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 13);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("innerHTML", ctx_r0.content, ɵɵsanitizeHtml);
  }
}
function NotificationComponent_div_1_div_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 14);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("innerHTML", ctx_r0.safeSvg, ɵɵsanitizeHtml);
  }
}
function NotificationComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div");
    ɵɵtemplate(1, NotificationComponent_div_1_div_1_Template, 2, 2, "div", 6)(2, NotificationComponent_div_1_ng_template_2_Template, 1, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(4, NotificationComponent_div_1_div_4_Template, 2, 2, "div", 7)(5, NotificationComponent_div_1_ng_template_5_Template, 1, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor)(7, NotificationComponent_div_1_div_7_Template, 1, 1, "div", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const regularTitle_r2 = ɵɵreference(3);
    const regularContent_r3 = ɵɵreference(6);
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r0.titleIsTemplate)("ngIfElse", regularTitle_r2);
    ɵɵadvance(3);
    ɵɵproperty("ngIf", ctx_r0.contentIsTemplate)("ngIfElse", regularContent_r3);
    ɵɵadvance(3);
    ɵɵproperty("ngIf", ctx_r0.item.icon !== "bare");
  }
}
function NotificationComponent_div_2_div_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NotificationComponent_div_2_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 17);
    ɵɵtemplate(1, NotificationComponent_div_2_div_1_ng_container_1_Template, 1, 0, "ng-container", 10);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.item.html)("ngTemplateOutletContext", ctx_r0.item.context);
  }
}
function NotificationComponent_div_2_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 13);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("innerHTML", ctx_r0.safeInputHtml, ɵɵsanitizeHtml);
  }
}
function NotificationComponent_div_2_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 18);
    ɵɵlistener("click", function NotificationComponent_div_2_div_4_Template_div_click_0_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r0 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r0.onClickIcon($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵclassProp("icon-hover", ctx_r0.clickIconToClose);
    ɵɵproperty("innerHTML", ctx_r0.safeSvg, ɵɵsanitizeHtml);
  }
}
function NotificationComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div");
    ɵɵtemplate(1, NotificationComponent_div_2_div_1_Template, 2, 2, "div", 15)(2, NotificationComponent_div_2_ng_template_2_Template, 1, 1, "ng-template", null, 2, ɵɵtemplateRefExtractor)(4, NotificationComponent_div_2_div_4_Template, 1, 3, "div", 16);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const regularHtml_r5 = ɵɵreference(3);
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r0.htmlIsTemplate)("ngIfElse", regularHtml_r5);
    ɵɵadvance(3);
    ɵɵproperty("ngIf", ctx_r0.item.icon);
  }
}
function NotificationComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 19);
    ɵɵelement(1, "span", 20);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngStyle", ɵɵpureFunction1(1, _c1, ctx_r0.progressWidth + "%"));
  }
}
function SimpleNotificationsComponent_simple_notification_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "simple-notification", 2);
  }
  if (rf & 2) {
    const a_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵproperty("item", a_r1)("timeOut", ctx_r2.timeOut)("clickToClose", ctx_r2.clickToClose)("clickIconToClose", ctx_r2.clickIconToClose)("maxLength", ctx_r2.maxLength)("showProgressBar", ctx_r2.showProgressBar)("pauseOnHover", ctx_r2.pauseOnHover)("theClass", ctx_r2.theClass)("rtl", ctx_r2.rtl)("animate", ctx_r2.animate)("position", i_r2);
  }
}
var DEFAULT_ICONS = {
  alert: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
    `,
  error: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
    `,
  info: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
        </svg>
    `,
  success: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
    `,
  warn: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="64" viewBox="0 0 64 64" height="64">
          <circle cx="32.086" cy="50.142" r="2.256"/>
          <path d="M30.08 25.012V42.32c0 1.107.897 2.005 2.006 2.005s2.006-.897 2.006-2.005V25.012c0-1.107-.897-2.006-2.006-2.006s-2.006.898-2.006 2.006z"/>
          <path d="M63.766 59.234L33.856 3.082c-.697-1.308-2.844-1.308-3.54 0L.407 59.234c-.331.622-.312 1.372.051 1.975.362.605 1.015.975 1.72.975h59.816c.705 0 1.357-.369 1.721-.975.361-.603.381-1.353.051-1.975zM5.519 58.172L32.086 8.291l26.568 49.881H5.519z"/>
        </svg>
    `
};
var NotificationType;
(function(NotificationType2) {
  NotificationType2["Success"] = "success";
  NotificationType2["Error"] = "error";
  NotificationType2["Alert"] = "alert";
  NotificationType2["Info"] = "info";
  NotificationType2["Warn"] = "warn";
  NotificationType2["Bare"] = "bare";
})(NotificationType || (NotificationType = {}));
var NotificationsService = class _NotificationsService {
  globalOptions;
  constructor(globalOptions) {
    this.globalOptions = globalOptions;
  }
  emitter = new Subject();
  icons = DEFAULT_ICONS;
  set(notification, to) {
    notification.id = notification.override && notification.override.id ? notification.override.id : Math.random().toString(36).substring(3);
    notification.click = new EventEmitter();
    notification.clickIcon = new EventEmitter();
    notification.timeoutEnd = new EventEmitter();
    this.emitter.next({
      command: "set",
      notification,
      add: to
    });
    return notification;
  }
  success(title = "", content = "", override, context) {
    return this.set({
      title,
      content: content || "",
      type: NotificationType.Success,
      icon: this.icons.success,
      override,
      context
    }, true);
  }
  error(title = "", content = "", override, context) {
    return this.set({
      title,
      content: content || "",
      type: NotificationType.Error,
      icon: this.icons.error,
      override,
      context
    }, true);
  }
  alert(title = "", content = "", override, context) {
    return this.set({
      title,
      content: content || "",
      type: NotificationType.Alert,
      icon: this.icons.alert,
      override,
      context
    }, true);
  }
  info(title = "", content = "", override, context) {
    return this.set({
      title,
      content: content || "",
      type: NotificationType.Info,
      icon: this.icons.info,
      override,
      context
    }, true);
  }
  warn(title = "", content = "", override, context) {
    return this.set({
      title,
      content: content || "",
      type: NotificationType.Warn,
      icon: this.icons.warn,
      override,
      context
    }, true);
  }
  bare(title = "", content = "", override, context) {
    return this.set({
      title,
      content: content || "",
      type: NotificationType.Bare,
      icon: "bare",
      override,
      context
    }, true);
  }
  // With type method
  create(title = "", content = "", type = NotificationType.Success, override, context) {
    return this.set({
      title,
      content,
      type,
      icon: this.icons[type],
      override,
      context
    }, true);
  }
  // HTML Notification method
  html(html, type = NotificationType.Success, override, icon = "bare", context) {
    return this.set({
      html,
      type,
      icon: this.icons[icon],
      override,
      context
    }, true);
  }
  // Remove all notifications method
  remove(id) {
    if (id) {
      this.emitter.next({
        command: "clean",
        id
      });
    } else {
      this.emitter.next({
        command: "cleanAll"
      });
    }
  }
  static ɵfac = function NotificationsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationsService)(ɵɵinject("options"));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NotificationsService,
    factory: _NotificationsService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationsService, [{
    type: Injectable
  }], function() {
    return [{
      type: void 0,
      decorators: [{
        type: Inject,
        args: ["options"]
      }]
    }];
  }, null);
})();
var NotificationComponent = class _NotificationComponent {
  notificationService;
  domSanitizer;
  cd;
  zone;
  timeOut;
  showProgressBar;
  pauseOnHover;
  clickToClose;
  clickIconToClose;
  maxLength;
  theClass;
  rtl;
  animate;
  position;
  item;
  // Progress bar variables
  title;
  content;
  titleIsTemplate = false;
  contentIsTemplate = false;
  htmlIsTemplate = false;
  progressWidth = 0;
  safeSvg;
  safeInputHtml;
  stopTime = false;
  timer;
  framesPerSecond = 40;
  sleepTime;
  startTime;
  endTime;
  pauseStart;
  icon;
  constructor(notificationService, domSanitizer, cd, zone) {
    this.notificationService = notificationService;
    this.domSanitizer = domSanitizer;
    this.cd = cd;
    this.zone = zone;
  }
  ngOnInit() {
    if (this.item.override) {
      this.attachOverrides();
    }
    if (this.animate) {
      this.item.state = this.animate;
    }
    if (this.timeOut !== 0) {
      this.startTimeOut();
    }
    this.contentType(this.item.title, "title");
    this.contentType(this.item.content, "content");
    this.contentType(this.item.html, "html");
    this.safeSvg = this.domSanitizer.bypassSecurityTrustHtml(this.icon || this.item.icon);
    this.safeInputHtml = this.domSanitizer.bypassSecurityTrustHtml(this.item.html);
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
    this.cd.detach();
  }
  startTimeOut() {
    this.sleepTime = 1e3 / this.framesPerSecond;
    this.startTime = (/* @__PURE__ */ new Date()).getTime();
    this.endTime = this.startTime + this.timeOut;
    this.zone.runOutsideAngular(() => this.timer = setTimeout(this.instance, this.sleepTime));
  }
  onEnter() {
    if (this.pauseOnHover) {
      this.stopTime = true;
      this.pauseStart = (/* @__PURE__ */ new Date()).getTime();
    }
  }
  onLeave() {
    if (this.pauseOnHover) {
      this.stopTime = false;
      this.startTime += (/* @__PURE__ */ new Date()).getTime() - this.pauseStart;
      this.endTime += (/* @__PURE__ */ new Date()).getTime() - this.pauseStart;
      this.zone.runOutsideAngular(() => setTimeout(this.instance, this.sleepTime));
    }
  }
  onClick(event) {
    this.item.click.emit(event);
    if (this.clickToClose) {
      this.remove();
    }
  }
  onClickIcon(event) {
    this.item.clickIcon.emit(event);
    if (this.clickIconToClose) {
      this.remove();
    }
  }
  // Attach all the overrides
  attachOverrides() {
    Object.keys(this.item.override).forEach((a) => {
      if (this.hasOwnProperty(a)) {
        this[a] = this.item.override[a];
      }
    });
  }
  instance = () => {
    const now = (/* @__PURE__ */ new Date()).getTime();
    if (this.endTime < now) {
      this.remove();
      this.item.timeoutEnd.emit();
    } else if (!this.stopTime) {
      if (this.showProgressBar) {
        this.progressWidth = Math.min((now - this.startTime + this.sleepTime) * 100 / this.timeOut, 100);
      }
      this.timer = setTimeout(this.instance, this.sleepTime);
    }
    this.zone.run(() => {
      if (!this.cd.destroyed) {
        this.cd.detectChanges();
      }
    });
  };
  remove() {
    if (this.animate) {
      this.item.state = this.animate + "Out";
      setTimeout(() => {
        this.notificationService.set(this.item, false);
      }, 310);
    } else {
      this.notificationService.set(this.item, false);
    }
  }
  contentType(item, key) {
    if (item instanceof TemplateRef) {
      this[key] = item;
    } else {
      this[key] = this.domSanitizer.bypassSecurityTrustHtml(item);
    }
    this[key + "IsTemplate"] = item instanceof TemplateRef;
  }
  static ɵfac = function NotificationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationComponent)(ɵɵdirectiveInject(NotificationsService), ɵɵdirectiveInject(DomSanitizer), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NotificationComponent,
    selectors: [["simple-notification"]],
    inputs: {
      timeOut: "timeOut",
      showProgressBar: "showProgressBar",
      pauseOnHover: "pauseOnHover",
      clickToClose: "clickToClose",
      clickIconToClose: "clickIconToClose",
      maxLength: "maxLength",
      theClass: "theClass",
      rtl: "rtl",
      animate: "animate",
      position: "position",
      item: "item"
    },
    standalone: false,
    decls: 4,
    vars: 16,
    consts: [["regularTitle", ""], ["regularContent", ""], ["regularHtml", ""], [1, "simple-notification", 3, "click", "mouseenter", "mouseleave", "ngClass"], [4, "ngIf"], ["class", "sn-progress-loader", 4, "ngIf"], ["class", "sn-title", 4, "ngIf", "ngIfElse"], ["class", "sn-content", 4, "ngIf", "ngIfElse"], ["class", "icon", 3, "innerHTML", 4, "ngIf"], [1, "sn-title"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "sn-title", 3, "innerHTML"], [1, "sn-content"], [1, "sn-content", 3, "innerHTML"], [1, "icon", 3, "innerHTML"], ["class", "sn-html", 4, "ngIf", "ngIfElse"], ["class", "icon", 3, "icon-hover", "innerHTML", "click", 4, "ngIf"], [1, "sn-html"], [1, "icon", 3, "click", "innerHTML"], [1, "sn-progress-loader"], [3, "ngStyle"]],
    template: function NotificationComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 3);
        ɵɵlistener("click", function NotificationComponent_Template_div_click_0_listener($event) {
          return ctx.onClick($event);
        })("mouseenter", function NotificationComponent_Template_div_mouseenter_0_listener() {
          return ctx.onEnter();
        })("mouseleave", function NotificationComponent_Template_div_mouseleave_0_listener() {
          return ctx.onLeave();
        });
        ɵɵtemplate(1, NotificationComponent_div_1_Template, 8, 5, "div", 4)(2, NotificationComponent_div_2_Template, 5, 3, "div", 4)(3, NotificationComponent_div_3_Template, 2, 3, "div", 5);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.theClass);
        ɵɵproperty("@enterLeave", ctx.item.state)("ngClass", ɵɵpureFunction8(7, _c0, ctx.item.type === "alert", ctx.item.type === "error", ctx.item.type === "warn", ctx.item.type === "success", ctx.item.type === "info", ctx.item.type === "bare", ctx.rtl, ctx.item.icon !== "bare"));
        ɵɵadvance();
        ɵɵproperty("ngIf", !ctx.item.html);
        ɵɵadvance();
        ɵɵproperty("ngIf", ctx.item.html);
        ɵɵadvance();
        ɵɵproperty("ngIf", ctx.showProgressBar);
      }
    },
    dependencies: [NgClass, NgIf, NgTemplateOutlet, NgStyle],
    styles: [".simple-notification{width:100%;padding:10px 20px;box-sizing:border-box;position:relative;float:left;margin-bottom:10px;color:#fff;cursor:pointer;transition:all .5s;min-height:70px}.simple-notification .sn-title,.simple-notification .sn-content,.simple-notification .sn-html{margin:0}.simple-notification .sn-title{line-height:30px;font-size:20px}.simple-notification .sn-content{font-size:16px;line-height:20px}.simple-notification.has-icon .sn-title,.simple-notification.has-icon .sn-content,.simple-notification.has-icon .sn-html{padding:0 50px 0 0}.simple-notification .icon{position:absolute;box-sizing:border-box;top:0;right:0;width:70px;height:70px;padding:10px}.simple-notification .icon.icon-hover:hover{opacity:.5}.simple-notification .icon svg{fill:#fff;width:100%;height:100%}.simple-notification .icon svg g{fill:#fff}.simple-notification.rtl-mode.has-icon .sn-title,.simple-notification.rtl-mode.has-icon .sn-content,.simple-notification.rtl-mode.has-icon .sn-html{padding:0 0 0 50px}.simple-notification.rtl-mode{direction:rtl}.simple-notification.rtl-mode .sn-content{padding:0 0 0 50px}.simple-notification.rtl-mode svg{left:0;right:auto}.simple-notification.error{background:#F44336}.simple-notification.success{background:#8BC34A}.simple-notification.alert{background:#ffdb5b}.simple-notification.info{background:#03A9F4}.simple-notification.warn{background:#ffdb5b}.simple-notification .sn-progress-loader{position:absolute;top:0;left:0;width:100%;height:5px}.simple-notification .sn-progress-loader span{float:left;height:100%}.simple-notification.success .sn-progress-loader span{background:#689F38}.simple-notification.error .sn-progress-loader span{background:#D32F2F}.simple-notification.alert .sn-progress-loader span{background:#edc242}.simple-notification.info .sn-progress-loader span{background:#0288D1}.simple-notification.warn .sn-progress-loader span{background:#edc242}.simple-notification.bare .sn-progress-loader span{background:#ccc}.simple-notification.warn div .sn-title,.simple-notification.warn div .sn-content,.simple-notification.warn div .sn-html{color:#444}\n"],
    encapsulation: 2,
    data: {
      animation: [trigger("enterLeave", [
        // Fade
        state("fade", style({
          opacity: 1
        })),
        transition("* => fade", [style({
          opacity: 0
        }), animate("400ms ease-in-out")]),
        state("fadeOut", style({
          opacity: 0
        })),
        transition("fade => fadeOut", [style({
          opacity: 1
        }), animate("300ms ease-in-out")]),
        // Enter from top
        state("fromTop", style({
          opacity: 1,
          transform: "translateY(0)"
        })),
        transition("* => fromTop", [style({
          opacity: 0,
          transform: "translateY(-5%)"
        }), animate("400ms ease-in-out")]),
        state("fromTopOut", style({
          opacity: 0,
          transform: "translateY(5%)"
        })),
        transition("fromTop => fromTopOut", [style({
          opacity: 1,
          transform: "translateY(0)"
        }), animate("300ms ease-in-out")]),
        // Enter from right
        state("fromRight", style({
          opacity: 1,
          transform: "translateX(0)"
        })),
        transition("* => fromRight", [style({
          opacity: 0,
          transform: "translateX(5%)"
        }), animate("400ms ease-in-out")]),
        state("fromRightOut", style({
          opacity: 0,
          transform: "translateX(-5%)"
        })),
        transition("fromRight => fromRightOut", [style({
          opacity: 1,
          transform: "translateX(0)"
        }), animate("300ms ease-in-out")]),
        // Enter from bottom
        state("fromBottom", style({
          opacity: 1,
          transform: "translateY(0)"
        })),
        transition("* => fromBottom", [style({
          opacity: 0,
          transform: "translateY(5%)"
        }), animate("400ms ease-in-out")]),
        state("fromBottomOut", style({
          opacity: 0,
          transform: "translateY(-5%)"
        })),
        transition("fromBottom => fromBottomOut", [style({
          opacity: 1,
          transform: "translateY(0)"
        }), animate("300ms ease-in-out")]),
        // Enter from left
        state("fromLeft", style({
          opacity: 1,
          transform: "translateX(0)"
        })),
        transition("* => fromLeft", [style({
          opacity: 0,
          transform: "translateX(-5%)"
        }), animate("400ms ease-in-out")]),
        state("fromLeftOut", style({
          opacity: 0,
          transform: "translateX(5%)"
        })),
        transition("fromLeft => fromLeftOut", [style({
          opacity: 1,
          transform: "translateX(0)"
        }), animate("300ms ease-in-out")]),
        // Rotate
        state("scale", style({
          opacity: 1,
          transform: "scale(1)"
        })),
        transition("* => scale", [style({
          opacity: 0,
          transform: "scale(0)"
        }), animate("400ms ease-in-out")]),
        state("scaleOut", style({
          opacity: 0,
          transform: "scale(0)"
        })),
        transition("scale => scaleOut", [style({
          opacity: 1,
          transform: "scale(1)"
        }), animate("400ms ease-in-out")]),
        // Scale
        state("rotate", style({
          opacity: 1,
          transform: "rotate(0deg)"
        })),
        transition("* => rotate", [style({
          opacity: 0,
          transform: "rotate(5deg)"
        }), animate("400ms ease-in-out")]),
        state("rotateOut", style({
          opacity: 0,
          transform: "rotate(-5deg)"
        })),
        transition("rotate => rotateOut", [style({
          opacity: 1,
          transform: "rotate(0deg)"
        }), animate("400ms ease-in-out")])
      ])]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationComponent, [{
    type: Component,
    args: [{
      selector: "simple-notification",
      encapsulation: ViewEncapsulation.None,
      animations: [trigger("enterLeave", [
        // Fade
        state("fade", style({
          opacity: 1
        })),
        transition("* => fade", [style({
          opacity: 0
        }), animate("400ms ease-in-out")]),
        state("fadeOut", style({
          opacity: 0
        })),
        transition("fade => fadeOut", [style({
          opacity: 1
        }), animate("300ms ease-in-out")]),
        // Enter from top
        state("fromTop", style({
          opacity: 1,
          transform: "translateY(0)"
        })),
        transition("* => fromTop", [style({
          opacity: 0,
          transform: "translateY(-5%)"
        }), animate("400ms ease-in-out")]),
        state("fromTopOut", style({
          opacity: 0,
          transform: "translateY(5%)"
        })),
        transition("fromTop => fromTopOut", [style({
          opacity: 1,
          transform: "translateY(0)"
        }), animate("300ms ease-in-out")]),
        // Enter from right
        state("fromRight", style({
          opacity: 1,
          transform: "translateX(0)"
        })),
        transition("* => fromRight", [style({
          opacity: 0,
          transform: "translateX(5%)"
        }), animate("400ms ease-in-out")]),
        state("fromRightOut", style({
          opacity: 0,
          transform: "translateX(-5%)"
        })),
        transition("fromRight => fromRightOut", [style({
          opacity: 1,
          transform: "translateX(0)"
        }), animate("300ms ease-in-out")]),
        // Enter from bottom
        state("fromBottom", style({
          opacity: 1,
          transform: "translateY(0)"
        })),
        transition("* => fromBottom", [style({
          opacity: 0,
          transform: "translateY(5%)"
        }), animate("400ms ease-in-out")]),
        state("fromBottomOut", style({
          opacity: 0,
          transform: "translateY(-5%)"
        })),
        transition("fromBottom => fromBottomOut", [style({
          opacity: 1,
          transform: "translateY(0)"
        }), animate("300ms ease-in-out")]),
        // Enter from left
        state("fromLeft", style({
          opacity: 1,
          transform: "translateX(0)"
        })),
        transition("* => fromLeft", [style({
          opacity: 0,
          transform: "translateX(-5%)"
        }), animate("400ms ease-in-out")]),
        state("fromLeftOut", style({
          opacity: 0,
          transform: "translateX(5%)"
        })),
        transition("fromLeft => fromLeftOut", [style({
          opacity: 1,
          transform: "translateX(0)"
        }), animate("300ms ease-in-out")]),
        // Rotate
        state("scale", style({
          opacity: 1,
          transform: "scale(1)"
        })),
        transition("* => scale", [style({
          opacity: 0,
          transform: "scale(0)"
        }), animate("400ms ease-in-out")]),
        state("scaleOut", style({
          opacity: 0,
          transform: "scale(0)"
        })),
        transition("scale => scaleOut", [style({
          opacity: 1,
          transform: "scale(1)"
        }), animate("400ms ease-in-out")]),
        // Scale
        state("rotate", style({
          opacity: 1,
          transform: "rotate(0deg)"
        })),
        transition("* => rotate", [style({
          opacity: 0,
          transform: "rotate(5deg)"
        }), animate("400ms ease-in-out")]),
        state("rotateOut", style({
          opacity: 0,
          transform: "rotate(-5deg)"
        })),
        transition("rotate => rotateOut", [style({
          opacity: 1,
          transform: "rotate(0deg)"
        }), animate("400ms ease-in-out")])
      ])],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<div class="simple-notification"\r
     [@enterLeave]="item.state"\r
     (click)="onClick($event)"\r
     [class]="theClass"\r
     [ngClass]="{\r
            'alert': item.type === 'alert',\r
            'error': item.type === 'error',\r
            'warn': item.type === 'warn',\r
            'success': item.type === 'success',\r
            'info': item.type === 'info',\r
            'bare': item.type === 'bare',\r
            'rtl-mode': rtl,\r
            'has-icon': item.icon !== 'bare'\r
        }"\r
     (mouseenter)="onEnter()"\r
     (mouseleave)="onLeave()">\r
\r
    <div *ngIf="!item.html">\r
\r
        <div class="sn-title" *ngIf="titleIsTemplate; else regularTitle">\r
            <ng-container *ngTemplateOutlet="title; context: item.context"></ng-container>\r
        </div>\r
\r
        <ng-template #regularTitle>\r
            <div class="sn-title" [innerHTML]="title"></div>\r
        </ng-template>\r
\r
        <div class="sn-content" *ngIf="contentIsTemplate else regularContent">\r
            <ng-container *ngTemplateOutlet="content; context: item.context"></ng-container>\r
        </div>\r
\r
        <ng-template #regularContent>\r
            <div class="sn-content" [innerHTML]="content"></div>\r
        </ng-template>\r
\r
        <div class="icon" *ngIf="item.icon !== 'bare'" [innerHTML]="safeSvg"></div>\r
    </div>\r
    <div *ngIf="item.html">\r
        <div class="sn-html" *ngIf="htmlIsTemplate; else regularHtml">\r
            <ng-container *ngTemplateOutlet="item.html; context: item.context"></ng-container>\r
        </div>\r
\r
        <ng-template #regularHtml>\r
            <div class="sn-content" [innerHTML]="safeInputHtml"></div>\r
        </ng-template>\r
\r
        <div class="icon" [class.icon-hover]="clickIconToClose" *ngIf="item.icon" [innerHTML]="safeSvg" (click)="onClickIcon($event)"></div>\r
    </div>\r
\r
    <div class="sn-progress-loader" *ngIf="showProgressBar">\r
        <span [ngStyle]="{'width': progressWidth + '%'}"></span>\r
    </div>\r
\r
</div>\r
`,
      styles: [".simple-notification{width:100%;padding:10px 20px;box-sizing:border-box;position:relative;float:left;margin-bottom:10px;color:#fff;cursor:pointer;transition:all .5s;min-height:70px}.simple-notification .sn-title,.simple-notification .sn-content,.simple-notification .sn-html{margin:0}.simple-notification .sn-title{line-height:30px;font-size:20px}.simple-notification .sn-content{font-size:16px;line-height:20px}.simple-notification.has-icon .sn-title,.simple-notification.has-icon .sn-content,.simple-notification.has-icon .sn-html{padding:0 50px 0 0}.simple-notification .icon{position:absolute;box-sizing:border-box;top:0;right:0;width:70px;height:70px;padding:10px}.simple-notification .icon.icon-hover:hover{opacity:.5}.simple-notification .icon svg{fill:#fff;width:100%;height:100%}.simple-notification .icon svg g{fill:#fff}.simple-notification.rtl-mode.has-icon .sn-title,.simple-notification.rtl-mode.has-icon .sn-content,.simple-notification.rtl-mode.has-icon .sn-html{padding:0 0 0 50px}.simple-notification.rtl-mode{direction:rtl}.simple-notification.rtl-mode .sn-content{padding:0 0 0 50px}.simple-notification.rtl-mode svg{left:0;right:auto}.simple-notification.error{background:#F44336}.simple-notification.success{background:#8BC34A}.simple-notification.alert{background:#ffdb5b}.simple-notification.info{background:#03A9F4}.simple-notification.warn{background:#ffdb5b}.simple-notification .sn-progress-loader{position:absolute;top:0;left:0;width:100%;height:5px}.simple-notification .sn-progress-loader span{float:left;height:100%}.simple-notification.success .sn-progress-loader span{background:#689F38}.simple-notification.error .sn-progress-loader span{background:#D32F2F}.simple-notification.alert .sn-progress-loader span{background:#edc242}.simple-notification.info .sn-progress-loader span{background:#0288D1}.simple-notification.warn .sn-progress-loader span{background:#edc242}.simple-notification.bare .sn-progress-loader span{background:#ccc}.simple-notification.warn div .sn-title,.simple-notification.warn div .sn-content,.simple-notification.warn div .sn-html{color:#444}\n"]
    }]
  }], function() {
    return [{
      type: NotificationsService
    }, {
      type: DomSanitizer
    }, {
      type: ChangeDetectorRef
    }, {
      type: NgZone
    }];
  }, {
    timeOut: [{
      type: Input
    }],
    showProgressBar: [{
      type: Input
    }],
    pauseOnHover: [{
      type: Input
    }],
    clickToClose: [{
      type: Input
    }],
    clickIconToClose: [{
      type: Input
    }],
    maxLength: [{
      type: Input
    }],
    theClass: [{
      type: Input
    }],
    rtl: [{
      type: Input
    }],
    animate: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    item: [{
      type: Input
    }]
  });
})();
var NotificationAnimationType;
(function(NotificationAnimationType2) {
  NotificationAnimationType2["Fade"] = "fade";
  NotificationAnimationType2["FromTop"] = "fromTop";
  NotificationAnimationType2["FromRight"] = "fromRight";
  NotificationAnimationType2["FromBottom"] = "fromBottom";
  NotificationAnimationType2["FromLeft"] = "fromLeft";
  NotificationAnimationType2["Scale"] = "scale";
  NotificationAnimationType2["Rotate"] = "rotate";
})(NotificationAnimationType || (NotificationAnimationType = {}));
var SimpleNotificationsComponent = class _SimpleNotificationsComponent {
  service;
  cd;
  constructor(service, cd) {
    this.service = service;
    this.cd = cd;
  }
  set options(opt) {
    this.usingComponentOptions = true;
    this.attachChanges(opt);
  }
  create = new EventEmitter();
  destroy = new EventEmitter();
  notifications = [];
  position = ["bottom", "right"];
  lastNotificationCreated;
  listener;
  // Received values
  lastOnBottom = true;
  maxStack = 8;
  preventLastDuplicates = false;
  preventDuplicates = false;
  // Sent values
  timeOut = 0;
  maxLength = 0;
  clickToClose = true;
  clickIconToClose = false;
  showProgressBar = true;
  pauseOnHover = true;
  theClass = "";
  rtl = false;
  animate = NotificationAnimationType.FromRight;
  usingComponentOptions = false;
  ngOnInit() {
    if (!this.usingComponentOptions) {
      this.attachChanges(this.service.globalOptions);
    }
    this.listener = this.service.emitter.subscribe((item) => {
      switch (item.command) {
        case "cleanAll":
          this.notifications = [];
          break;
        case "clean":
          this.cleanSingle(item.id);
          break;
        case "set":
          if (item.add) {
            this.add(item.notification);
          } else {
            this.defaultBehavior(item);
          }
          break;
        default:
          this.defaultBehavior(item);
          break;
      }
      if (!this.cd.destroyed) {
        this.cd.detectChanges();
      }
    });
  }
  ngOnDestroy() {
    if (this.listener) {
      this.listener.unsubscribe();
    }
    this.cd.detach();
  }
  // Default behavior on event
  defaultBehavior(value) {
    this.notifications.splice(this.notifications.indexOf(value.notification), 1);
    this.destroy.emit(this.buildEmit(value.notification, false));
  }
  // Add the new notification to the notification array
  add(item) {
    item.createdOn = /* @__PURE__ */ new Date();
    const toBlock = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;
    this.lastNotificationCreated = item;
    if (item.override && item.override.icons && item.override.icons[item.type]) {
      item.icon = item.override.icons[item.type];
    }
    if (!toBlock) {
      if (this.lastOnBottom) {
        if (this.notifications.length >= this.maxStack) {
          this.notifications.splice(0, 1);
        }
        this.notifications.push(item);
      } else {
        if (this.notifications.length >= this.maxStack) {
          this.notifications.splice(this.notifications.length - 1, 1);
        }
        this.notifications.splice(0, 0, item);
      }
      this.create.emit(this.buildEmit(item, true));
    }
  }
  // Check if notifications should be prevented
  block(item) {
    const toCheck = item.html ? this.checkHtml : this.checkStandard;
    if (this.preventDuplicates && this.notifications.length > 0) {
      for (const notification of this.notifications) {
        if (toCheck(notification, item)) {
          return true;
        }
      }
    }
    if (this.preventLastDuplicates) {
      let comp;
      if (this.preventLastDuplicates === "visible" && this.notifications.length > 0) {
        if (this.lastOnBottom) {
          comp = this.notifications[this.notifications.length - 1];
        } else {
          comp = this.notifications[0];
        }
      } else if (this.preventLastDuplicates === "all" && this.lastNotificationCreated) {
        comp = this.lastNotificationCreated;
      } else {
        return false;
      }
      return toCheck(comp, item);
    }
    return false;
  }
  checkStandard(checker, item) {
    return checker.type === item.type && checker.title === item.title && checker.content === item.content;
  }
  checkHtml(checker, item) {
    return checker.html ? checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html : false;
  }
  // Attach all the changes received in the options object
  attachChanges(options) {
    for (const key in options) {
      if (this.hasOwnProperty(key)) {
        this[key] = options[key];
      } else if (key === "icons") {
        this.service.icons = options[key];
      }
    }
  }
  buildEmit(notification, to) {
    const toEmit = {
      createdOn: notification.createdOn,
      type: notification.type,
      icon: notification.icon,
      id: notification.id
    };
    if (notification.html) {
      toEmit.html = notification.html;
    } else {
      toEmit.title = notification.title;
      toEmit.content = notification.content;
    }
    if (!to) {
      toEmit.destroyedOn = /* @__PURE__ */ new Date();
    }
    return toEmit;
  }
  cleanSingle(id) {
    let indexOfDelete = 0;
    let doDelete = false;
    let noti;
    this.notifications.forEach((notification, idx) => {
      if (notification.id === id) {
        indexOfDelete = idx;
        noti = notification;
        doDelete = true;
      }
    });
    if (doDelete) {
      this.notifications.splice(indexOfDelete, 1);
      this.destroy.emit(this.buildEmit(noti, false));
    }
  }
  static ɵfac = function SimpleNotificationsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SimpleNotificationsComponent)(ɵɵdirectiveInject(NotificationsService), ɵɵdirectiveInject(ChangeDetectorRef));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _SimpleNotificationsComponent,
    selectors: [["simple-notifications"]],
    inputs: {
      options: "options"
    },
    outputs: {
      create: "create",
      destroy: "destroy"
    },
    standalone: false,
    decls: 2,
    vars: 2,
    consts: [[1, "simple-notification-wrapper", 3, "ngClass"], [3, "item", "timeOut", "clickToClose", "clickIconToClose", "maxLength", "showProgressBar", "pauseOnHover", "theClass", "rtl", "animate", "position", 4, "ngFor", "ngForOf"], [3, "item", "timeOut", "clickToClose", "clickIconToClose", "maxLength", "showProgressBar", "pauseOnHover", "theClass", "rtl", "animate", "position"]],
    template: function SimpleNotificationsComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 0);
        ɵɵtemplate(1, SimpleNotificationsComponent_simple_notification_1_Template, 1, 11, "simple-notification", 1);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵproperty("ngClass", ctx.position);
        ɵɵadvance();
        ɵɵproperty("ngForOf", ctx.notifications);
      }
    },
    dependencies: [NgClass, NgForOf, NotificationComponent],
    styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SimpleNotificationsComponent, [{
    type: Component,
    args: [{
      selector: "simple-notifications",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<div class="simple-notification-wrapper" [ngClass]="position">\r\n    <simple-notification\r\n            *ngFor="let a of notifications; let i = index"\r\n            [item]="a"\r\n            [timeOut]="timeOut"\r\n            [clickToClose]="clickToClose"\r\n            [clickIconToClose]="clickIconToClose"\r\n            [maxLength]="maxLength"\r\n            [showProgressBar]="showProgressBar"\r\n            [pauseOnHover]="pauseOnHover"\r\n            [theClass]="theClass"\r\n            [rtl]="rtl"\r\n            [animate]="animate"\r\n            [position]="i">\r\n    </simple-notification>\r\n</div>',
      styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"]
    }]
  }], function() {
    return [{
      type: NotificationsService
    }, {
      type: ChangeDetectorRef
    }];
  }, {
    options: [{
      type: Input
    }],
    create: [{
      type: Output
    }],
    destroy: [{
      type: Output
    }]
  });
})();
var DEFAULT_OPTIONS = {
  position: ["bottom", "right"],
  timeOut: 0,
  showProgressBar: true,
  pauseOnHover: true,
  lastOnBottom: true,
  clickToClose: true,
  clickIconToClose: false,
  maxLength: 0,
  maxStack: 8,
  preventDuplicates: false,
  preventLastDuplicates: false,
  theClass: "",
  rtl: false,
  animate: NotificationAnimationType.FromRight,
  icons: DEFAULT_ICONS
};
var OPTIONS = new InjectionToken("options");
function optionsFactory(options) {
  return __spreadValues(__spreadValues({}, DEFAULT_OPTIONS), options);
}
var SimpleNotificationsModule = class _SimpleNotificationsModule {
  static forRoot(options = {}) {
    return {
      ngModule: _SimpleNotificationsModule,
      providers: [NotificationsService, {
        provide: OPTIONS,
        useValue: options
      }, {
        provide: "options",
        useFactory: optionsFactory,
        deps: [OPTIONS]
      }]
    };
  }
  static ɵfac = function SimpleNotificationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SimpleNotificationsModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _SimpleNotificationsModule,
    declarations: [SimpleNotificationsComponent, NotificationComponent],
    imports: [CommonModule],
    exports: [SimpleNotificationsComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [CommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SimpleNotificationsModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [SimpleNotificationsComponent, NotificationComponent],
      exports: [SimpleNotificationsComponent]
    }]
  }], null, null);
})();
export {
  NotificationAnimationType,
  NotificationComponent,
  NotificationType,
  NotificationsService,
  OPTIONS,
  SimpleNotificationsComponent,
  SimpleNotificationsModule,
  optionsFactory
};
/*! Bundled license information:

@angular/animations/fesm2022/animations.mjs:
  (**
   * @license Angular v19.2.15
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=angular2-notifications.js.map
