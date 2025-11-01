import type { SxProps, Theme } from "@mui/material/styles"
import { alpha } from "@mui/material/styles"

/**
 * Estilos compartilhados para contêineres DataGrid usando a API Sx do MUI.
 *
 * Esta função recebe o tema e retorna um objeto SxProps<Theme> aplicado tipicamente
 * ao wrapper/contêiner que envolve um componente DataGrid (Material UI).
 *
 * Detalhes:
 * - Encapsula estilos do container externo e regras específicas para classes
 *   internas do DataGrid (cabeçalho, linhas, células, rodapé e overlay).
 * - Utiliza o objeto `theme` para garantir consistência com as cores, sombras
 *   e espaçamentos definidos no tema da aplicação.
 * - Projetado para ser reaplicado em diferentes páginas/visões que usam DataGrid.
 *
 * Parâmetros:
 * @param theme - Instância do tema do MUI (Theme) usada para derivar valores.
 *
 * Retorno:
 * @returns SxProps<Theme> — objeto compatível com a prop `sx` do MUI.
 *
 * Exemplo de uso:
 * <Box sx={dataGridStyles}>
 *   <DataGrid rows={rows} columns={cols} />
 * </Box>
 *
 * Observação:
 * - Não altera comportamento do DataGrid em si; apenas provê uma camada visual
 *   consistente para o projeto.
 * - Desde: 1.0.0
 */
export const dataGridStyles: SxProps<Theme> = (theme: Theme) => ({
  // Estilos do container do DataGrid
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  boxShadow: theme.shadows[1],
  backgroundColor: "theme.palette.background.paper",
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  // Estilos para o elemento raiz do DataGrid
  "& .MuiDataGrid-root": {
    border: "none",
    flexGrow: 1,
    // aplicar borda arredondada também no elemento raiz para que as células/cabeçalho
    // respeitem os cantos do container pai
    borderRadius: "8px",
    overflow: "hidden",
  },

  // Alguns elementos internos também precisam ter borderRadius/overflow em versões
  // diferentes do DataGrid
  "& .MuiDataGrid-main": {
    borderRadius: "8px",
    overflow: "hidden",
  },

  // Estilos do cabeçalho
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "theme.palette.grey[100]",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },

  // Estilos das linhas
  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.grey[200], 0.5),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.2),
      cursor: "pointer",
    },
    transition: `background-color 0.2s ease-in-out`,
  },

  // Estilos das células
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  // Remover outline visual quando a célula for focada por clique (preservando
  // indicação de foco para navegação por teclado via :focus-visible)
  "& .MuiDataGrid-cell:focus:not(:focus-visible), & .MuiDataGrid-columnHeader:focus:not(:focus-visible), & .MuiDataGrid-row:focus:not(:focus-visible)":
    {
      outline: "none",
      boxShadow: "none",
    },

  // Também garantir que seleções de linha não exibam outline indesejado ao clicar
  "& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:focus": {
    outline: "none",
    boxShadow: "none",
  },

  // Estilos do rodapé
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
    // Estilos para o select de paginação
    "& .MuiInputBase-root": {
      // Estado normal: com borda para destaque
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "4px",
      // Estado focado: remove borda
      "&.Mui-focused": {
        border: "none",
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      },
      // Remove a borda padrão do outline
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },

  // Estilo para quando não há linhas
  "& .MuiDataGrid-overlay": {
    backgroundColor: alpha(theme.palette.background.default, 0.7),
  },
})
