import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'greatThan'
})
export class MyCustomPipePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    if(value <= 0){
      return args;
    }
    return args.filter(item => item.GPA >= value);
  }

}
