import { AlignmentType, Document, HeadingLevel, Paragraph, TextRun } from "docx";

export class DocumentCreator {
    public create(resume: any[]): Document {
        const document = new Document({
            styles: {
                paragraphStyles: [
                    {
                        id: "Heading1",
                        name: "Heading 1",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 24,
                            bold: true,
                            font: "Verdana"
                        },
                        paragraph: {
                            spacing: {
                                after: 20 * 72 * 0.05
                            }
                        },
                    },
                    {
                        id: "Heading2",
                        name: "Heading 2",
                        basedOn: "Norma2",
                        next: "Normal",
                        run: {
                            size: 36,
                            font: "Verdana"
                        },
                        paragraph: {
                            spacing: {
                                line: 200,
                                after: 20 * 72 * 0.05
                            },
                        }
                    },
                    {
                        id: "Heading3",
                        name: "Heading 3",
                        run: {
                            size: 20,
                            font: "Verdana"
                        },
                    },

                ]
            },
            sections: [
                {
                    children: [
                        this.criaNomeCentro(resume[0].dados.nome),
                        this.criaContatoInfo(resume[0].dados),
                        this.criaCabecalho("Objetivo"),

                        this.criaObjetivo(resume[0].objetivo),
                        /* this.createFormacao(resume[0].formacoes),  */
                        this.criaCabecalho("Formação"),
                        ...resume[0].formacoes
                            .map((formacao: any) => {
                                const arr: Paragraph[] = [];
                                arr.push(
                                    this.createFormacao(
                                        formacao.escolaridade,
                                        formacao.instituicao,
                                        formacao.inicio,
                                        formacao.termino,
                                        formacao.status
                                    )
                                );
                                return arr;
                            }).reduce((prev: any, curr: any) => prev.concat(curr), []),
                        this.criaCabecalho("Experiências"),
                        ...resume[0].experiencias
                            .map((experiencia: any) => {
                                const arr: Paragraph[] = [];
                                arr.push(
                                    this.criarExperiencias(
                                        experiencia.funcao,
                                        experiencia.empresa,
                                        experiencia.inicio,
                                        experiencia.termino
                                    )
                                );

                                const bulletPoints =
                                    this.separaParagrafosEmLista(experiencia.descricao);

                                bulletPoints.forEach(bulletPoint => {
                                    arr.push(this.criaLista(bulletPoint))
                                });
                                return arr;
                            })
                            .reduce((prev: any, curr: any) => prev.concat(curr), []),
                        this.criaCabecalho("Habilidades"),                       
                        ...this.criarHabilidades(resume[0].habilidades)

                    ]
                }
            ]
        });
        return document;
    }

    public criarHabilidades(habilidades: any[]): Paragraph[] {
        return habilidades.map(
            habilidade =>
            new Paragraph({
                text: habilidade,
                bullet: {
                  level: 0
                }
              })
        )
    }

    public criaContatoInfo(dados: any): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_3,
            children: [
                new TextRun(
                    `${dados.nacionalidade} | ${dados.estadoCivil} | ${dados.idade} Anos | CNH: ${dados.cnh}`,
                ),
                new TextRun({
                    break: 1
                }),
                new TextRun(
                    `${dados.bairro}, ${dados.cidade}/${dados.estado}`
                ),
                new TextRun({
                    break: 1
                }),
                new TextRun(
                    `Telefone:  ${dados.telefone} | Celular: ${dados.celular} | Email: ${dados.email}`
                ),
                new TextRun({ break: 1 })
            ]
        })
    }

    public criaObjetivo(objetivo: string): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
                new TextRun(
                    {
                        text: `${objetivo}`,
                        font: "Verdana"
                    }
                ),
                new TextRun({ break: 1 })
            ]
        })
    }

    public PulaLinha() {
        return new Paragraph({
            children: [
                new TextRun({
                    break: 1
                })
            ]
        })
    }

    public createFormacao(
        escolaridade: string,
        instituicao: string,
        inicio: string,
        termino: string,
        status: string): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.LEFT
            , children: [
                new TextRun({
                    text: `${escolaridade}, ${instituicao}`,
                    bold: true,
                    font: "Verdana"
                }),
                new TextRun({
                    break: 1
                }),
                new TextRun({
                    text: `${inicio} - ${termino}  (${status})`,
                    font: "Verdana"
                }),
                new TextRun({ break: 1 })
            ]
        });
    }

    public criaCabecalho(text: string): Paragraph {
        return new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
                new TextRun({
                    break: 1
                }),
                new TextRun({
                    text: text
                })
            ],
        });
    }

    public criaNomeCentro(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            children: [
            ]
        })
    }

    public criaLista(text: string): Paragraph {
        return new Paragraph({
            text: text,
            bullet: {
                level: 0
            }
        });
    }

    public separaParagrafosEmLista(text: string): string[] {
        return text.split("\n\n");
    }

    public criarExperiencias(funcao: string, empresa: string, inicio: string, termino: string): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
                new TextRun(
                    {
                        text: `${funcao}`,
                        font: "Verdana"
                    }
                ),
                new TextRun({
                    break: 1
                }),
                new TextRun({
                    text: `${empresa} (${inicio} - ${termino})`,
                    font: "Verdana"
                }),
                new TextRun({ break: 1 })
            ]
        })
    }

    public criaProjetos(objetivo: string): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
                new TextRun({
                    text: `PROJETOS`,
                    bold: true
                }),
                new TextRun({
                    break: 1
                }),
                new TextRun(
                    `${objetivo}`
                )
            ]
        })
    }
};



