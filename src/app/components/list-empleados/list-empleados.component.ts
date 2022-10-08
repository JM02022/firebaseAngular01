import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {
  empleados: any[] = []
  eliminar = false

  constructor(private empleadosService:EmpleadoService) { }

  ngOnInit(): void {
    this.getEmpleados()
  }

  getEmpleados(){
    this.empleadosService.getEmpleados().subscribe(data => {
      this.empleados = []
      data.forEach((element:any) => {
        //element.payload.doc.id // id de las colecciones
        //element.payload.doc.data() -> datos
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    })
  }

  eliminarEmpleado(id:string){
    this.empleadosService.eliminarEmpleado(id).then( () => {
      this.eliminar = true
      setTimeout(() => {
        this.eliminar = false
      }, 1500);
    }).catch(error => {
      console.log(error)
    })
  }
}
