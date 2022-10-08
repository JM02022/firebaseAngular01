import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado:FormGroup
  submited = false
  loading = false
  exitoso = false
  id:string | null
  titulo = 'Agregar empleado'

  constructor(private fb:FormBuilder,private EmpleadoService: EmpleadoService,private router:Router,private aRoute:ActivatedRoute) { 
    this.createEmpleado = this.fb.group({
      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      documento: ['',Validators.required],
      salario: ['',Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id')
    //console.log(this.id) //id de la ruta anterior

  }

  ngOnInit(): void {
    this.esEditar()
  }

  agregarEditarEmpleado(){
    this.submited = true
    if(this.createEmpleado.invalid){
      return
    }
    if(this.id === null){
      this.agregarEmpleado()
    }else{
      this.editarEmpleado(this.id)
    }
  }

  editarEmpleado(id:string){
    this.loading = true
    const empleado:any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date(),
    }
    this.EmpleadoService.actualizarEmpleado(id,empleado).then(() => {
      this.loading = false
      this.exitoso = true
      setTimeout(() => {
        this.router.navigate(['/list-empleados'])
      }, 1500);
    })
  }

  agregarEmpleado(){
    const empleado:any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    this.loading = true
    this.EmpleadoService.agregarEmpleado(empleado).then(() => {
      this.loading = false
      this.exitoso = true
      setTimeout(() => {
        this.router.navigate(['/list-empleados'])
      }, 1500);
    }).catch(error => {
      this.loading = false
      console.log(error)
    })
  }

  esEditar(){
    if(this.id !== null){
      this.EmpleadoService.getEmpleado(this.id).subscribe(data => {
        this.titulo = "Editar empleado"
        //data.payload.data()['nombre'] => retornar nombre
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        })
      })
    }
  }
}
