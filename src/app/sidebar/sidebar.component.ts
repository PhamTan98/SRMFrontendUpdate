import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',           title: 'Trang chủ',             icon:'nc-bank',       class: '' },
    { path: '/danh-sach-sinh-vien', title: 'Sinh viên',   icon:'nc-bullet-list-67',    class: '' },
    { path: '/danh-sach-check-in',            title: 'Check-in',    icon:'nc-bell-55',    class: '' },
    { path: '/list-test',            title: 'Test',    icon:'nc-bullet-list-67',    class: '' },
    { path: '/list-bai-test',            title: 'Bài Test',    icon:'nc-badge',    class: '' },
    { path: '/danh-sach-user',            title: 'Người dùng',    icon:'nc-circle-10',    class: '' },
    // { path: '/dashboard',           title: 'Trang chủ',             icon:'nc-bank',       class: '' },
    // { path: '/danh-sach-sinh-vien', title: 'Sinh viên',   icon:'nc-bullet-list-67',    class: '' },
    // { path: '/danh-sach-check-in',            title: 'Check-in',    icon:'nc-bell-55',    class: '' },
    // { path: '/list-test',            title: 'Test',    icon:'nc-bullet-list-67',    class: '' },
    // { path: '/list-bai-test',            title: 'Bài Test',    icon:'nc-badge',    class: '' },
    // { path: '/danh-sach-user',            title: 'Người dùng',    icon:'nc-circle-10',    class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls:['sidebar.component.css']
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    private menuNormal;
    private mainPanel;
    private sideBar;
    private showMenuBtn;
    private hideMenuBtn;
    private hoverBtn;
    private showIndex= 100;
    private hideIndex = 99;
    private show = true;
    private showSideBar = false; 
   
    ngOnInit() {

        this.menuItems = ROUTES.filter(menuItem => menuItem);
        // this.inputBox = document.getElementsByClassName('openSidebarMenu')[0];
        this.mainPanel =  document.getElementById('main-panel');
        this.sideBar =  document.getElementById('sidebar');
        this.menuNormal = document.getElementById('sidebar-wrapper');
        this.hideMenuBtn = document.getElementById('icon-hide');
        this.showMenuBtn = document.getElementById('icon-show');
        this.hoverBtn = document.getElementById('icon-hover');
        
        var ss = sessionStorage.getItem('showSideBar');
        if (ss === "true" && window.innerWidth >= 991) {
          this.sideBar.style.width = "58px";
          this.mainPanel.style.width = "calc(100% - 58px)";
          this.menuNormal.classList.add('menu-full-size');
          this.hideMenuBtn.classList.add('opacity-btn');
          this.showMenuBtn.classList.remove('opacity-btn');
          this.showMenuBtn.classList.remove('d-none');
          this.hideMenuBtn.classList.add('d-none');
          this.hoverBtn.classList.add('d-none');
          this.showSideBar = true;
        } else if(ss === "false" && window.innerWidth >= 991){
          this.sideBar.style.width = "185px";
          this.mainPanel.style.width = "calc(100% - 185px)";
          this.showMenuBtn.classList.add('opacity-btn');
          this.hideMenuBtn.classList.remove('opacity-btn');
          this.hideMenuBtn.classList.remove('d-none');
          this.hoverBtn.classList.remove('d-none');
          this.hideIndex = 99; 
          this.showIndex = 100;
          this.menuNormal.classList.remove('menu-full-size');
          this.showSideBar = false;
        }
    }
    saveOptionToSession(){
      sessionStorage.setItem('showSideBar', this.showSideBar.toString());
    }
    sidebarToggle() {
      if (this.showSideBar === true && window.innerWidth >= 991) {
          this.sidebarOpen();
      } else if(this.showSideBar === false && window.innerWidth >= 991){
          this.sidebarClose();
      }
      sessionStorage.setItem('showSideBar', this.showSideBar.toString());
    }
    sidebarOpen(){
      this.sideBar.style.width = "185px";
      this.mainPanel.style.width = "calc(100% - 185px)";
      this.showMenuBtn.classList.add('opacity-btn');
      this.hideMenuBtn.classList.remove('opacity-btn');
      this.hideMenuBtn.classList.remove('d-none');
      this.hoverBtn.classList.remove('d-none');
      this.hideIndex = 99; 
      this.showIndex = 100;
      this.menuNormal.classList.remove('menu-full-size');
      this.showSideBar = false;
    }

    sidebarClose(){
      this.sideBar.style.width = "58px";
      this.mainPanel.style.width = "calc(100% - 58px)";
      this.menuNormal.classList.add('menu-full-size');
      this.hideMenuBtn.classList.add('opacity-btn');
      this.showMenuBtn.classList.remove('opacity-btn');
      this.showMenuBtn.classList.remove('d-none');
      this.hideMenuBtn.classList.add('d-none');
      this.hoverBtn.classList.add('d-none');
      this.showSideBar = true;
    }
    hoverShow(){
      this.hideMenuBtn.classList.remove('d-none');
      this.hoverBtn.classList.add('d-none');
    }
    outHide(){
      this.hideMenuBtn.classList.add('d-none');
      this.hoverBtn.classList.remove('d-none');
    }
}
