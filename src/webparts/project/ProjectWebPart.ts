import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'ProjectWebPartStrings';
import Project from './components/Project';
import { IProjectProps } from './components/IProjectProps';
import { PNPDataService } from './Services';


export interface IProjectWebPartProps {
  description: string;
}

export default class ProjectWebPart extends BaseClientSideWebPart<IProjectWebPartProps> {

  public render(): void {

    
    // let service = new PNPDataService(); // Skapa ett object från en class för att kunna anråpa en method

    // service.getData(this.context.pageContext.web.absoluteUrl).then((result) => {  // anråpar methoden getData
      const element: React.ReactElement<IProjectProps > = React.createElement(
        Project,
        {
          description: this.properties.description,
          // products:result,  // data från SP
          context: this.context,
          userNme: this.context.pageContext.user.displayName,
          siteUrl: this.context.pageContext.web.absoluteUrl
        }
      );
  
      //den här egenskapen är en pekare till root Dom-elementet i webbdelen
      ReactDom.render(element, this.domElement); 
    // });
  }
    

   

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  
//denna api används för att ge konfigurationen  för att bygga fastighetsrutan för webbdelen
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
