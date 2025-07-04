import { Alert } from "react-bootstrap";

function Message({ variant, children }: { variant: string; children: React.ReactNode }) {
	return (
		<Alert variant={variant} className="mt-3">
			{children}
		</Alert>
	);
}

Message.defaultProps = {
	variant: "info",
};

export default Message;
