import { ToastSeverity, ToastSeverityOptions } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { ToastServiceMethods } from 'primevue/toastservice';
import { ConfirmationOptions } from 'primevue/confirmationoptions';

let toast: ToastServiceMethods;
let confirm: {
  require: (option: ConfirmationOptions) => void;
  close: () => void;
}

function initNotifyService() {
  toast = useToast();
  confirm = useConfirm();
}

function _msg(severity: unknown, title: string, body: string, lifeTime = 3000): void {
  // @ts-ignore
  toast.add({ severity: severity as ToastSeverityOptions, summary: title, detail: body, life: lifeTime });
}

function info(title, body: string, lifeTime = 3000): void {
  _msg(ToastSeverity.INFO, title, body, lifeTime);
};

function success(title: string, body: string, lifeTime = 3000): void {
  _msg(ToastSeverity.SUCCESS, title, body, lifeTime);
};

function warn(title: string, body: string, lifeTime = 3000): void {
  _msg(ToastSeverity.WARN, title, body, lifeTime);
};

function error(title: string, body: string, lifeTime = 3000): void {
  _msg(ToastSeverity.ERROR, title, body, lifeTime);
};

function _confirmation(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  icon: string = "",
  onReject: () => Promise<void>,
  type: "success" | "danger",
) {
  confirm.require({
    message: body,
    header: title,
    icon: icon,
    acceptClass: `${type}btn`,
    accept: onAccept,
    reject: onReject,
  });
}

function confirmSuccess(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  icon: string = "",
  onReject: () => Promise<void> = async () => { }
) {
  _confirmation(title, body, onAccept, icon, onReject, "success")
}

function confirmDanger(
  title: string,
  body: string,
  onAccept: () => Promise<void>,
  icon: string = "",
  onReject: () => Promise<void> = async () => { }
) {
  _confirmation(title, body, onAccept, icon, onReject, "danger")
}

const msg = {
  info,
  success,
  warn,
  error,
}

export { initNotifyService, confirmSuccess, confirmDanger, msg }