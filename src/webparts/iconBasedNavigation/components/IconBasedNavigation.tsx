import * as React from 'react';
import styles from './IconBasedNavigation.module.scss';
import { IIconBasedNavigationProps } from './IIconBasedNavigationProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class IconBasedNavigation extends React.Component<IIconBasedNavigationProps, {}> {
  public render(): React.ReactElement<IIconBasedNavigationProps> {
    return (
      <div className={ styles.iconBasedNavigation }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.iconListName)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
