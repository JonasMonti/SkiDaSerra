type TableLinkProps = {
  linkId: string;
  text: string;
  type: "client" | "ski-lesson" | "slope-access";
};

export const TableLink = (props: TableLinkProps) => {
  return (
    <a
      href={`/admin/${props.type}/${props.linkId}`}
      className="flex items-center gap-2 text-primary transition-opacity hover:opacity-80"
    >
      {props.text}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="h-4 w-4"
      >
        <line x1="7" x2="17" y1="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
      </svg>
    </a>
  );
};
