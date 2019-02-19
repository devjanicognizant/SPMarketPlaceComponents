/// <reference types="react" />
import * as React from 'react';
import { IIconBasedNavigationProps } from './IIconBasedNavigationProps';
import { ListItem } from '../../commonServices/ListItem';
export interface IIconBasedNavigationState {
    icons: any[];
    listItems: Array<ListItem>;
}
export default class IconBasedNavigation extends React.Component<IIconBasedNavigationProps, IIconBasedNavigationState> {
    constructor(props: IIconBasedNavigationProps, state: IIconBasedNavigationState);
    componentDidMount(): void;
    private getCompCount;
    render(): React.ReactElement<IIconBasedNavigationProps>;
}
