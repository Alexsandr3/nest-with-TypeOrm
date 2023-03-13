import { SortDirectionType } from '../common/pagination.dto';

export class ValidateValue {
  validateValue(inputValue, arrayString, defaultValue): string {
    return arrayString.includes(inputValue) ? inputValue : defaultValue;
  }

  validateEnum(inputValue, anyEnum, defaultValue): string {
    return Object.values(anyEnum).includes(inputValue) ? inputValue : defaultValue;
  }

  validateSortDirection(sortDirection): 'ASC' | 'DESC' {
    return sortDirection === SortDirectionType.Asc ? 'ASC' : 'DESC';
  }

  validatePageSize(pageSize): number {
    if (isNaN(pageSize)) {
      return 10;
    }
    if (pageSize < 1) {
      return 10;
    }
    return pageSize;
  }

  validatePageNumber(pageNumber): number {
    if (isNaN(pageNumber)) {
      return 1;
    }
    if (pageNumber < 1) {
      return 1;
    }
    return pageNumber;
  }
}
