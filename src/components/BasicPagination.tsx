import { MouseEventHandler } from "react";
import { Pagination } from "react-bootstrap";

interface PaginationProps {
  onNextClick: MouseEventHandler<HTMLElement>;
  onPrevClick: MouseEventHandler<HTMLElement>;
  hasNext?: string;
  hasPrev?: string;
}

const BasicPagination = ({
  onNextClick,
  onPrevClick,
  hasNext,
  hasPrev,
}: PaginationProps) => {
  return (
    <Pagination>
      {hasPrev && <Pagination.Prev onClick={onPrevClick}>Prev</Pagination.Prev>}
      {hasNext && <Pagination.Next onClick={onNextClick}>Next</Pagination.Next>}
    </Pagination>
  );
};

export default BasicPagination;
