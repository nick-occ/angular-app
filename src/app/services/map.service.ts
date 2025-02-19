import { Injectable } from '@angular/core';
import {from, Observable, Observer, of, BehaviorSubject} from 'rxjs';

import {Project} from '../shared/models/project';
import {PROJECT} from '../shared/mocks/mock-project';

import {MapCategory} from '../shared/models/map-category'
import {MAP_CATEGORY} from '../shared/mocks/mock-map-category';

import {MapVariable} from '../shared/models/map-variable'
import {MAP_VARIABLE} from '../shared/mocks/mock-map-variable';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable.js";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  project!: Project;
  mapCategories: MapCategory[] = []
  mapVariables: MapVariable[] = []
  selectedCategory!: MapCategory;
  selectedVariable!: MapVariable;
  colorVariable: ColorVariable = new ColorVariable({
    normalizationField: 'mfagetote',
    stops: [
      {
        value: .01, 
        color: "#eefae3", 
        label: "1% or lower"
      },
      {
        value: .04, 
        color: "#bae4bc", 
        label: "4% or higher" 
      },
      {
        value: .08, 
        color: "#7bccc4", 
        label: "8% or higher" 
      },
      {
        value: .12, 
        color: "#43a2ca", 
        label: "12% or higher" 
      },
      {
        value: .16, 
        color: "#0868ac", 
        label: "16% or higher"
      }
    ]
  });

  featureLayer: FeatureLayer = new FeatureLayer({
    portalItem: {
      id: 'b7a386ae3c8b404bb856631f936a1e04'
    },
    definitionExpression:'year = 2021',
    opacity: 1,
    renderer: new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: [ 51,51, 204, 0.9 ],
        style: "solid",
        outline: {
          color: [0,0,0, 0.2],
          width: "2px"
        }
      }),
      visualVariables: [this.colorVariable]
    })
  });

  private currentVariable = new BehaviorSubject<MapVariable>(MAP_VARIABLE[0]);
  // private currentVariable:MapVariable = MAP_VARIABLE[0];

  constructor() { }

  getProject(id: number): Observable<Project> {
    return of(PROJECT.filter((project) => project.projectId === id).reduce((acc: any, it) => it, { }));
  }

  getMapCategories(): Observable<MapCategory[]> {
    return of(MAP_CATEGORY.filter( mc => this.project?.mapCategories.includes(mc.categoryId)));
  }

  getMapVariables(): Observable<MapVariable[]> {
    let mapVariables = MAP_CATEGORY.filter( mc => mc.categoryId == this.selectedCategory.categoryId).reduce((acc: any, it) => it, { }).mapVariables
    return of(MAP_VARIABLE.filter(mv => mapVariables.includes(mv.variableId)))
  }

  getSelectedVariable(): Observable<MapVariable> {
    return of(this.selectedVariable)
  }

  getCurrentVariable(): Observable<MapVariable> {
    return this.currentVariable.asObservable();
    // return of(this.currentVariable);
  }

  updateCurrentVariable(newVariable:MapVariable) {
    this.currentVariable.next(newVariable)
    // this.currentVariable = newVariable;
  }
}
