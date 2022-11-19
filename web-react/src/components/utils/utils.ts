/**
 * Funções usadas pelos componentes
 * @module Util
 * @category Componentes
 */

/**
 * Monta um menu conforme opções
 * @param {Function[]} handles Handles das opções
 * @param {boolean[]} disableds Array contendo opções de disable de cada menu
 * @param {string[]} labels Array contendo lista de labels
 * @param {string[]} icons Array contendo lista de icons
 * @returns {Object[]} contendo objectos de cada menu como label, command, disable, icon.
 */
export function montaMenuGrid(
  handles: any[] = [],
  disableds: boolean[] = [],
  labels = ['Visualizar', 'Alterar', 'Excluir'],
  icons = ['pi pi-search', 'pi pi-pencil', 'pi pi-trash']
): any {
  let i;
  const retorno = [];
  for (i = 0; i < labels.length; i++) {
    const e: any = {};
    if (labels[i]) {
      e.label = labels[i];
      if (icons[i]) {
        e.icon = icons[i];
      }
      if (handles[i]) {
        e.command = handles[i];
      }
      if (disableds[i]) {
        e.disabled = true;
      }
      retorno.push(e);
    }
  }
  return retorno;
}
