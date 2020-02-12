import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { AuthenticationService } from '../../Authentication/_services';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    private showhide = true;
    private menuNormal;
    private mainPanel;
    private sideBar;
    private inputBox;
    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;
    

    constructor(location:Location, private renderer : Renderer, private element : ElementRef, private router: Router, private authenticationService: AuthenticationService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    public Email = this.authenticationService.currentUserValue.Email;
    
    ngOnInit(){

        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;

        this.inputBox = <HTMLElement>document.getElementsByClassName('openSidebarMenu')[0];
        this.mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        this.sideBar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
        this.menuNormal = <HTMLElement>document.getElementsByClassName('sidebar-wrapper')[0];
        
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
    }

    logout(){
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
    
    sidebarToggle() {
      if (this.sidebarVisible === false) {
          this.sidebarOpen();
      } else {
          this.sidebarClose();
      }
    }
    sidebarOpen() {
        this.menuNormal.classList.remove('menu-full-size');
        this.sideBar.style.width = "185px";
        this.mainPanel.style.width = "calc(100% - 185px)";
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');
        if (window.innerWidth < 991) {
          mainPanel.style.position = 'fixed';
        }
        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        if (window.innerWidth < 991) {
          setTimeout(function(){
            mainPanel.style.position = '';
          }, 500);
        }
        this.toggleButton.classList.remove('toggled');
        html.classList.remove('nav-open');
        this.sidebarVisible = false;
    };
    collapse(){
      this.isCollapsed = !this.isCollapsed;
      const navbar = document.getElementsByTagName('nav')[0];
      console.log(navbar);
      if (!this.isCollapsed) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('bg-white');
      }else{
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('bg-white');
      }
    }
      
}
