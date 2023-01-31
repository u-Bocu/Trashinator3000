import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ScansService } from "../../services/scans.service";
import { LocalStorageService } from "../../services/local-storage.service";
import {EventService} from "../../services/event.service";

@Component({
  selector: 'app-waste-form',
  templateUrl: './waste-form.component.html',
  styleUrls: ['./waste-form.component.css']
})

export class WasteFormComponent {

  form = this.fb.group({});
  files: any[] = [];
  imageArray: any[] = [];
  dataArray : any[] = []
  confidenceArray : any[] = []
  typeOfWasteArray : any[] = []

  constructor(
    private fb: FormBuilder,
    private scansService: ScansService,
    private localStorageService: LocalStorageService,
    private eventService: EventService
  ) {}


  /**
   * on file drop handler
   */
  onFileDropped($event: any[]): void {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any[]): void {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number): void {
    this.files.splice(index, 1);
    this.imageArray.splice(index,1);
    this.dataArray.splice(index,1);
    this.confidenceArray.splice(index,1);
    this.typeOfWasteArray.splice(index,1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number): void {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 25;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      //Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = () => {
      this.imageArray.push(reader.result); //Le nom a modifier

      item.progress = 0;
      item.image = reader.result
      this.files.push(item)
    }
  }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals?: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals! <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    this.scansService.postScan(this.imageArray, this.localStorageService.getData('user_id'))
      .subscribe(response => {

        this.dataArray = []
        this.confidenceArray = []
        this.typeOfWasteArray = []

        for(let i =0; i < response.length; i++)
        {
          this.dataArray.push(JSON.parse(response[i]).data.output)
          this.confidenceArray.push(JSON.parse(response[i]).data.confidence + "%")
        }

        for(let i = 0; i < this.dataArray.length;i++)
        {
          if(this.dataArray.at(i) == "Plastic" || this.dataArray.at(i) == "Paper" || this.dataArray.at(i) == "G&M")
          {
            this.typeOfWasteArray.push("Recyclable")
          }
          else if(this.dataArray.at(i) == "Organic")
          {
            this.typeOfWasteArray.push("Organique")
          }
          else if(this.dataArray.at(i) == "Other")
          {
            this.typeOfWasteArray.push("Non-recyclable")
          }
          this.eventService.emitRefreshNavigationEvent();
      }
    });
  }
}
