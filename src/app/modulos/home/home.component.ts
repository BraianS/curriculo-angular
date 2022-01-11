import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { cnhTipos, escolaridade, statusTipos } from 'src/app/core/const';
import { ConsultaCepService } from 'src/app/core/services/consulta-cep.service';
import { RequiredEEmailValidacao } from 'src/app/core/validators/Validators';
import { DocumentCreator } from './cv-generator';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  resume: any;
  escolaridade = escolaridade;
  statusTipos = statusTipos;
  cnhTipos = cnhTipos;

  constructor(
    private formBuilder: FormBuilder,
    private consultarCepService: ConsultaCepService,
    private http: HttpClient) {

    this.resume = this.formBuilder.group({
      dados: this.formBuilder.group({
        nome: ['', Validators.required],
        idade: ['', Validators.required],
        nacionalidade: ['', Validators.required],
        estadoCivil: ['', Validators.required],
        cnh: this.formBuilder.array([]),
        email: ['', RequiredEEmailValidacao],
        cep: ['',],
        cidade: ['', Validators.required],
        bairro: ['', Validators.required],
        estado: ['', Validators.required],
        numero: [''],
        logradouro: ['', Validators.required],
        telefone: ['', Validators.required],
        celular: ['', Validators.required]
      }),
      objetivo: ['', Validators.required],
      formacoes: this.formBuilder.array([
        this.iniciarFormacao()
      ]),
      experiencias: this.formBuilder.array([
        this.iniciaExperiencia(),
      ]),
      habilidades: this.formBuilder.array([
        this.criarHabilidade()
      ])
    });

  }

  criarHabilidade(): FormGroup {
    return this.formBuilder.group({
      nome: ['']
    })
  }

  onCHeckboxChange(e: any) {
    const cnh: FormArray = this.dados.cnh as FormArray;

    if (e.target.checked) {
      cnh.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      cnh.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          cnh.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnInit(): void {

  }


  public download(): void {
    const documentCreator = new DocumentCreator();

    

    const doc = documentCreator.create([
      this.resume.value
    ]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob,"Curriculo.docx")
      console.log("Documento criado com sucesso");
    })

  }

  public downloadExemplo(): void {
    const documentCreator = new DocumentCreator();

    var data = null;
    this.http.get("assets/data.json").subscribe(response => {

      data = response;
      console.log(data);

      const doc = documentCreator.create([
        data
      ]);

      Packer.toBlob(doc).then(blob => {
        console.log(blob);
        saveAs(blob, "Exemplo.docx");
        console.log("Documento criado com sucesso");
      })

    });
  }

  iniciarFormacao() {
    return this.formBuilder.group({
      escolaridade: ['', Validators.required],
      instituicao: ['', Validators.required],
      inicio: ['', Validators.required],
      termino: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  iniciaExperiencia() {
    return this.formBuilder.group({
      funcao: ['', Validators.required],
      empresa: ['', Validators.required],
      inicio: ['', Validators.required],
      termino: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  //get dados  ========================

  get dados(): { [key: string]: AbstractControl } {
    return this.resume.controls.dados.controls;
  }

  get formacaoControls(): { [key: string]: AbstractControl } {
    return this.resume.controls.formacao.controls;
  }

  get experienciaControl() {
    return this.resume.get('experiencias') as FormArray;
  }

  get habilidadesControl() {
    return this.resume.get('habilidades') as FormArray;
  }

  get formacoesControl() {
    return this.resume.get('formacoes') as FormArray;
  }

  get habilidades(): FormArray {
    return <FormArray>this.resume.get('habilidades');
  }  

  adicionaHabilidade() {
    this.habilidadesControl.push(this.criarHabilidade());
  }

  removeHabilidade() {
    this.habilidadesControl.removeAt(this.habilidades.length -1);
  }

  adicionaFormacao() {
    this.formacoesControl.push(this.iniciarFormacao());
  }

  adicionaEscolaridade() {
    this.formacoesControl.push(this.iniciarFormacao())
  }

  removeEscolaridade() {
    this.formacoesControl.removeAt(this.formacoesControl.length - 1);
  }

  get resumeControls(): { [key: string]: AbstractControl } {
    return this.resume.controls;
  }

  adicionaLink() {
    this.experienciaControl.push(this.iniciaExperiencia());
  }

  removeLink() {
    this.experienciaControl.removeAt(this.experienciaControl.length - 1);
  }

  resetResumeForm() {
    const cnh: FormArray = this.dados.cnh as FormArray;
    cnh.removeAt(0);
    this.resume.reset(true);
  }

  onConsultaCep() {
    let cep = this.resume.get('dados.cep').value;

    this.consultarCepService.consultaCep(cep).subscribe((response: any) => {

      const dados = this.resume.get("dados");

      dados.controls.logradouro.patchValue(response.logradouro);
      dados.controls.bairro.patchValue(response.bairro);
      dados.controls.cidade.patchValue(response.localidade);
      dados.controls.estado.patchValue(response.uf);
      dados.controls.cep.patchValue(response.cpf);

    })
  }

  resetarForm() {
    this.resume.reset();
    console.log(this.resume);
  }

}
