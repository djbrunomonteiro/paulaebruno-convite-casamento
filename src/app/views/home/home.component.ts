import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { first } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AlertComponent } from 'src/app/share/alert/alert.component';
import { DialogComponent } from 'src/app/share/dialog/dialog.component';
import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  slideIndexRef = 0;
  slidesRef: Swiper | undefined;
  sliderAtual = 0;

  imgsWeeding: any[] = [];

  user: any;

  private startTime: Date = new Date();
  private endTime: Date = new Date("2023-08-18T18:30:00");;
  private intervalId: any;


  confirmacaoConvidado = 'nao';

  cronometro: any;

  getScreenWidth: any;
  getScreenHeight: any;


  constructor(
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public appService: AppService,
    private activated: ActivatedRoute,
  ) {
    this.intervalId = 0;
  }

  ngOnInit(): void {
    this.gerarLinksImgs();
    this.getUser();
    this.start();
    this.getScreen();
    this.checkConfirmacao();
    // this.appService.gerarLInks().subscribe(res=> console.log(res)); //para dev
  }
  

  checkConfirmacao() {
    this.confirmacaoConvidado = localStorage.getItem('casamento_paulaebruno_confirmado') ?? 'nao';
  }

  slideChanged(slides: any) {
    //get index do slide atual
    slides.getActiveIndex().then((index: number) => {
      if (!index) { return; };
      this.slideIndexRef = index;
    });
  }

  getSwiper(swiper: Swiper) {
    if (!swiper) { return; };
    this.slidesRef = swiper;
    this.sliderAtual = this.slidesRef?.realIndex;
  }


  gerarLinksImgs() {
    this.imgsWeeding = [];
    for (let index = 0; index < 39; index++) {
      const elem = {
        image: `assets/imgs/pre-wedding/${index}.jpg`,
        thumbImage: `assets/imgs/pre-wedding/${index}.jpg`,
        alt: '',
        title: `foto-${index}.jpg`
      }

      this.imgsWeeding.push(elem)

    }
  }

  copyPix() {
    this._clipboardService.copy('98970278027');
    this.openSnackBar();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(AlertComponent, { duration: 2000 });
  }

  getUser() {
    const nomes = this.activated?.snapshot?.paramMap.get('nomes');
    this.appService.getOne(nomes).subscribe(res => this.user = res)

  }

  confirmarPresenca(): void {
    localStorage.setItem('casamento_paulaebruno_confirmado', 'sim');
    this.checkConfirmacao();

  }

  start(): void {
    this.intervalId = setInterval(() => {
      const currentTime = new Date();
      const remainingTime = this.endTime.getTime() - currentTime.getTime();

      if (remainingTime <= 0) {
        this.stop();
        console.log("Cronômetro finalizado!");
      } else {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        this.cronometro = `${days} dias, ${hours}h:${minutes}min:${seconds}seg`
      }
    }, 1000);
  }

  stop(): void {
    clearInterval(this.intervalId);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreen();
  }

  getScreen() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }



}
