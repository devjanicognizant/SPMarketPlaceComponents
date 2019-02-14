/// <reference types="react" />
import * as React from 'react';
import { IHomeProps } from './IHomeProps';
import { IHomeState } from './IHomeState';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import './Dropdown.Basic.Example.scss';
export default class Home extends React.Component<IHomeProps, IHomeState> {
    private uniqueId;
    constructor(props: IHomeProps);
    componentWillMount(): void;
    private inputSearch;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private getCurrentUserDetails();
    private renderLike(item, index);
    /**
     * This method renders the swiper using properteis
     */
    render(): React.ReactElement<IHomeProps>;
    onSetLike: (index: any, item: any) => void;
    onSetUnlike: (index: any, item: any) => void;
    onLikeSort: () => void;
    onLatestSort: () => void;
    /**
     * This method sort datasource and set it in state according to selected criteria.
     * e.g. Most Liked - sort sccording to likes column desending
     * Latest - sort according to created date/id desending
     */
    _LoadFavourites: (selectedOption: string) => void;
    /**
   * This method filter datasource in state and set it in state according to selected filter criteria
   * selected records will be sorted accordingly selected sort criteria e.g Most Liked, Latest
   */
    _LoadFilters: (item: IDropdownOption) => void;
}
