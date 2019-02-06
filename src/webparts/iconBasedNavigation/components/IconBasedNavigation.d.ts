/// <reference types="react" />
import * as React from 'react';
import { IIconBasedNavigationProps } from './IIconBasedNavigationProps';
export interface IIconBasedNavigationState {
    icons: any[];
}
export default class IconBasedNavigation extends React.Component<IIconBasedNavigationProps, IIconBasedNavigationState> {
    constructor(props: IIconBasedNavigationProps, state: IIconBasedNavigationState);
    componentDidMount(): void;
    render(): React.ReactElement<IIconBasedNavigationProps>;
}
