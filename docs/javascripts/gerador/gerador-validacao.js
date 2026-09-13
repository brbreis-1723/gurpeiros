/* =========================================================
   VALIDAÇÃO
   ========================================================= */

function validarMagia(magia) {

    const resultado = {

        erros: [],

        avisos: [],

        campos: [],

        penalidadeCalculada:
            calcularPenalidade(
                magia
            )
    };


    if (
        valorVazio(
            magia.nome
        )
    ) {

        resultado.erros.push(
            "Nome da magia não informado."
        );

        resultado.campos.push({
            tipo: "erro",
            seletor: "#gm-nome"
        });
    }


    if (
        !DOMINIOS.includes(
            magia.dominio
        )
    ) {

        resultado.erros.push(
            "Domínio inválido ou não informado."
        );

        resultado.campos.push({
            tipo: "erro",
            seletor: "#gm-dominio"
        });
    }


    const nivel =
        Number(
            magia.nivel
        );


    if (
        !Number.isInteger(nivel) ||
        !NIVEIS[nivel]
    ) {

        resultado.erros.push(
            "Nível inválido. O nível deve estar entre 1 e 5."
        );

        resultado.campos.push({
            tipo: "erro",
            seletor: "#gm-nivel"
        });

    } else if (
        magia.nivel_nome !==
        NIVEIS[nivel]
    ) {

        resultado.avisos.push(
            `O nível ${nivel} corresponde a "${NIVEIS[nivel]}", mas nivel_nome está como "${magia.nivel_nome || "(vazio)"}".`
        );

        resultado.campos.push({
            tipo: "aviso",
            seletor: "#gm-nivel-nome"
        });
    }


    if (
        !CATEGORIAS.includes(
            magia.categoria
        )
    ) {

        resultado.erros.push(
            "Categoria inválida ou não informada."
        );

        resultado.campos.push({
            tipo: "erro",
            seletor: "#gm-categoria"
        });
    }


    if (
        valorVazio(
            magia.efeito
        )
    ) {

        resultado.avisos.push(
            "A magia não possui descrição de efeito."
        );

        resultado.campos.push({
            tipo: "aviso",
            seletor: "#gm-efeito"
        });
    }


    PARAMETROS_OBRIGATORIOS
        .forEach(nome => {

            const lista =
                magia.parametros?.[
                    nome
                ];


            if (
                lista === undefined
            ) {

                resultado.erros.push(
                    `Parâmetro obrigatório ausente: ${nomeParametro(nome)}.`
                );

                return;
            }


            if (
                !Array.isArray(lista)
            ) {

                resultado.erros.push(
                    `O parâmetro "${nomeParametro(nome)}" deve ser um array.`
                );

                return;
            }


            if (
                lista.length !== 1
            ) {

                resultado.erros.push(
                    `O parâmetro obrigatório "${nomeParametro(nome)}" deve possuir exatamente um item.`
                );
            }


            lista.forEach(
                (item, indice) =>
                    validarItemParametro(
                        nome,
                        item,
                        indice,
                        resultado
                    )
            );
        });


    Object.keys(
        magia.parametros || {}
    ).forEach(nome => {

        if (
            !PARAMETROS.includes(
                nome
            )
        ) {

            resultado.avisos.push(
                `Parâmetro desconhecido: "${nome}".`
            );

            return;
        }


        const lista =
            magia.parametros[nome];


        if (
            !Array.isArray(lista)
        ) {

            resultado.erros.push(
                `O parâmetro "${nomeParametro(nome)}" deve ser um array.`
            );

            return;
        }


        if (
            lista.length === 0
        ) {

            resultado.avisos.push(
                `O parâmetro "${nomeParametro(nome)}" está vazio; ele será omitido na exportação.`
            );
        }


        lista.forEach(
            (item, indice) =>
                validarItemParametro(
                    nome,
                    item,
                    indice,
                    resultado
                )
        );
    });


    if (
        numero(
            magia.penalidade
        ) !==
        resultado.penalidadeCalculada
    ) {

        resultado.avisos.push(
            `A penalidade armazenada (${magia.penalidade}) é diferente da penalidade calculada (${resultado.penalidadeCalculada}).`
        );
    }


    return resultado;
}


function validarItemParametro(
    nome,
    item,
    indice,
    resultado
) {

    const caminho =
        `${nomeParametro(nome)} — item ${indice + 1}`;


    const seletor =
        `[data-item-parametro="${escaparSeletor(nome)}"][data-indice="${indice}"]`;


    if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
    ) {

        resultado.erros.push(
            `${caminho}: item inválido.`
        );

        return;
    }


    if (nome === "dano") {

        const quantidade =
            Number(
                item?.detalhes
                    ?.quantidade_d6
            );


        if (
            !Number.isFinite(
                quantidade
            ) ||
            quantidade < 1
        ) {

            resultado.erros.push(
                `${caminho}: quantidade de d6 não informada.`
            );

            resultado.campos.push({
                tipo: "erro",
                seletor:
                    `${seletor} [data-detalhe="quantidade_d6"]`
            });
        }


    } else if (
        nome ===
        "caracteristicas_alteradas"
    ) {

        const pontos =
            Number(
                item?.detalhes?.pontos
            );


        if (
            !Number.isFinite(
                pontos
            ) ||
            pontos < 1
        ) {

            resultado.erros.push(
                `${caminho}: Pontos não informados.`
            );

            resultado.campos.push({
                tipo: "erro",
                seletor:
                    `${seletor} [data-detalhe="pontos"]`
            });
        }


        if (
            valorVazio(
                item?.detalhes
                    ?.alvo
            )
        ) {

            resultado.avisos.push(
                `${caminho}: informe o atributo, vantagem ou desvantagem afetado.`
            );

            resultado.campos.push({
                tipo: "aviso",
                seletor:
                    `${seletor} [data-detalhe="alvo"]`
            });
        }


    } else if (
        nome ===
        "conceder_bonus"
    ) {

        if (
            valorVazio(
                item?.detalhes
                    ?.alvo
            )
        ) {

            resultado.avisos.push(
                `${caminho}: informe a perícia ou conjunto de habilidades afetado no campo Detalhe.`
            );

            resultado.campos.push({
                tipo: "aviso",
                seletor:
                    `${seletor} [data-detalhe="alvo"]`
            });
        }


    } else if (
        nome === "cura"
    ) {

        const opcao =
            encontrarOpcao(
                nome,
                item.valor
            );


        if (!opcao) {

            if (
                valorVazio(
                    item.valor
                )
            ) {

                resultado.erros.push(
                    `${caminho}: valor não informado.`
                );

                resultado.campos.push({
                    tipo: "erro",
                    seletor:
                        `${seletor} [data-campo="valor"]`
                });
            }

        } else {

            const texto =
                String(
                    opcao.modificador ??
                    ""
                );


            if (
                texto.includes(
                    "2 PF"
                )
            ) {

                const pf =
                    Number(
                        item.detalhes
                            ?.qtd_pf
                    );


                if (
                    !Number.isFinite(
                        pf
                    ) ||
                    pf < 1
                ) {

                    resultado.erros.push(
                        `${caminho}: Qtd PF não informada.`
                    );

                    resultado.campos.push({
                        tipo: "erro",
                        seletor:
                            `${seletor} [data-detalhe="qtd_pf"]`
                    });
                }


            } else if (
                texto.includes(
                    "1d6 PV"
                )
            ) {

                const d6 =
                    Number(
                        item.detalhes
                            ?.pv_d6
                    );


                if (
                    !Number.isFinite(
                        d6
                    ) ||
                    d6 < 1
                ) {

                    resultado.erros.push(
                        `${caminho}: PV (d6) não informado.`
                    );

                    resultado.campos.push({
                        tipo: "erro",
                        seletor:
                            `${seletor} [data-detalhe="pv_d6"]`
                    });
                }
            }
        }


    } else if (
        nome ===
        "modificadores_ataque"
    ) {

        const valorString =
            String(item.valor || "").toLowerCase();


        if (
            valorString.startsWith("cone")
        ) {

            const baseMetros =
                Number(
                    item.detalhes
                        ?.base_metros
                );


            if (
                !Number.isFinite(
                    baseMetros
                ) ||
                baseMetros < 1
            ) {

                resultado.erros.push(
                    `${caminho}: a base do cone (metros) deve ser pelo menos 1m.`
                );

                resultado.campos.push({
                    tipo: "erro",
                    seletor:
                        `${seletor} [data-detalhe="base_metros"]`
                });
            }


        } else if (
            valorString.includes("fragmentação") ||
            valorString.includes("fragmentacao")
        ) {

            const quantidade =
                Number(
                    item.detalhes
                        ?.quantidade_d6
                );


            if (
                !Number.isFinite(
                    quantidade
                ) ||
                quantidade < 1
            ) {

                resultado.erros.push(
                    `${caminho}: dados de fragmentação (d6) não informados.`
                );

                resultado.campos.push({
                    tipo: "erro",
                    seletor:
                        `${seletor} [data-detalhe="quantidade_d6"]`
                });
            }

        } else {

            const opcao =
                encontrarOpcao(
                    nome,
                    item.valor
                );


            if (opcao) {

                const texto =
                    String(
                        opcao.modificador ??
                        ""
                    );


                if (
                    texto
                        .toLowerCase()
                        .includes("ciclo")
                ) {

                    const ciclos =
                        Number(
                            item.detalhes
                                ?.quantidade_ciclos
                        );


                    if (
                        !Number.isFinite(
                            ciclos
                        ) ||
                        ciclos < 1
                    ) {

                        resultado.erros.push(
                            `${caminho}: quantidade de ciclos não informada.`
                        );

                        resultado.campos.push({
                            tipo: "erro",
                            seletor:
                                `${seletor} [data-detalhe="quantidade_ciclos"]`
                        });
                    }
                }
            }
        }
    }


    if (
        nome !== "dano" &&
        valorVazio(
            item.valor
        )
    ) {

        resultado.erros.push(
            `${caminho}: valor não informado.`
        );

        resultado.campos.push({
            tipo: "erro",
            seletor:
                `${seletor} [data-campo="valor"]`
        });
    }


    if (
        !Number.isFinite(
            Number(
                item.modificador
            )
        )
    ) {

        resultado.erros.push(
            `${caminho}: modificador inválido.`
        );

        resultado.campos.push({
            tipo: "erro",
            seletor:
                `${seletor} [data-campo="modificador"]`
        });
    }


    const calculado =
        calcularModificadorItem(
            nome,
            item
        );


    if (
        calculado === null
    ) {

        if (
            nome !== "dano" &&
            !valorVazio(
                item.valor
            )
        ) {

            resultado.avisos.push(
                `${caminho}: o valor não foi encontrado na tabela ou exige detalhes adicionais para calcular o modificador.`
            );
        }


    } else if (
        numero(
            item.modificador
        ) !== calculado
    ) {

        resultado.avisos.push(
            `${caminho}: modificador informado (${item.modificador}) difere do modificador calculado (${calculado}).`
        );

        resultado.campos.push({
            tipo: "aviso",
            seletor:
                `${seletor} [data-campo="modificador"]`
        });
    }
}