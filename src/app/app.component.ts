import {Component, HostListener} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  priceForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    car: ['', Validators.required],
  })

  carsData:any;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  // Подгружаем данные с сервера по автомобилям
  ngOnInit(){
    this.appService.getData(this.category).subscribe(carsData => this.carsData = carsData);
  }

  // Функция скролла при нажатии на клавишу
  goScroll(target: HTMLElement, car?: any) {
    target.scrollIntoView({behavior: "smooth"});
    if (car) {
      this.priceForm.patchValue({car: car.name});
    }
  }
  //  Функция переключения селектора класса авто
  category: string = 'sport';
  toggleCategory(category: string) {
    this.category = category;
    this.ngOnInit();
  }

  // Анимация первой перед подвалом
  trans: any;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.trans = {transform: 'translate3d(' + ((e.clientX * 0.3) / 8) + 'px,' + ((e.clientY * 0.3) / 8) + 'px,0px)'};
  }

  // Анимация картинки главной картинки
  bgPos: any;

  @HostListener('document:scroll', ['$event'])
  onScroll() {
    this.bgPos = {backgroundPositionX: '0' + (0.2 * window.scrollY) + 'px'};
  }

  // Функционал кнопки сабмит (валидация формы и отправка формы)
  onSubmit() {
    if (this.priceForm.valid) {
      this.appService.sendQuery(this.priceForm.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message);
              this.priceForm.reset();
            },
            error: (response) => {
              alert(response.error.message);
            }
          }
        );
    }
  }
}
