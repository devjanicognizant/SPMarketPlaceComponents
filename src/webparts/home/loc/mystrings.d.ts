declare interface IHomeWebPartStrings {
  SwiperOptions: string;
  GeneralGroupName: string;
  EnableNavigation: string;
  EnablePagination: string;
  SlidesPerWiew: string;
  AutoplayGroupName: string;
  EnableAutoplay: string;
  DelayAutoplay: string;
  Miliseconds: string;
  DisableAutoplayOnInteraction: string;
  AdvancedGroupName: string;
  SlidesPerGroup: string;
  SpaceBetweenSlides: string;
  InPixels: string;
  EnableGrabCursor: string;
  EnableLoop: string;
  SourceList:string;
  DataSourceGroupName:string;
  ImageColumnName:string;
  TitleColumnName:string;
  FilterColumnName:string;
  OrderBy:string;
  IsAsending:string;
  SelectTop:string;
  ShowCategoryFilter:string;
  ShowLatestFilter:string;
  RedirectURL:string;
}

declare module 'HomeWebPartStrings' {
  const strings: IReactSlideSwiperWebPartStrings;
  export = strings;
}
