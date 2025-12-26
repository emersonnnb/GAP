import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Produto = {
  id: number;
  nome: string;
  sku: string;
  preco: number;
};

type ItemCarrinho = {
  produto: Produto;
  qtd: number;
};

type MetodoPagamento = 'DINHEIRO' | 'CARTAO' | 'PIX';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendas.html',
  styleUrl: './vendas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vendas {
  private readonly destroyRef = inject(DestroyRef);

  readonly barcodeInput = viewChild<ElementRef<HTMLInputElement>>('barcodeInput');

  // === state ===
  readonly produtos = signal<Produto[]>([
    { id: 1, nome: 'Camisa Básica', sku: 'CAM-001', preco: 59.9 },
    { id: 2, nome: 'Calça Jeans', sku: 'CAL-010', preco: 149.9 },
    { id: 3, nome: 'Tênis Casual', sku: 'TEN-200', preco: 219.9 },
    { id: 4, nome: 'Boné', sku: 'BON-020', preco: 39.9 },
  ]);

  readonly termo = signal('');
  readonly codigoBarras = signal('');
  readonly carrinho = signal<ItemCarrinho[]>([]);
  readonly desconto = signal(0);
  readonly frete = signal(0);

  readonly metodo = signal<MetodoPagamento>('CARTAO');
  readonly recebido = signal(0);
  readonly showPagamento = signal(false);

  // === derived ===
  readonly produtosFiltrados = computed(() => {
    const t = this.termo().trim().toLowerCase();
    if (!t) return this.produtos();
    return this.produtos().filter((p) =>
      `${p.nome} ${p.sku} ${p.id}`.toLowerCase().includes(t),
    );
  });

  readonly subtotal = computed(() =>
    this.carrinho().reduce((acc, i) => acc + i.qtd * i.produto.preco, 0),
  );

  readonly total = computed(() =>
    Math.max(this.subtotal() + this.frete() - this.desconto(), 0),
  );

  readonly troco = computed(() => {
    if (this.metodo() !== 'DINHEIRO') return 0;
    return Math.max(this.recebido() - this.total(), 0);
  });

  constructor() {
    // Foco inicial automático assim que o input existir
    effect(() => {
      const el = this.barcodeInput()?.nativeElement;
      if (el) queueMicrotask(() => el.focus());
    });

    // Atalho opcional: ESC fecha modal de pagamento
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((e) => e.key === 'Escape'),
      )
      .subscribe(() => this.showPagamento.set(false));
  }

  private focusBarcode(): void {
    queueMicrotask(() => this.barcodeInput()?.nativeElement?.focus());
  }

  onPdvClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.focusBarcode();
  }

  // === carrinho ===
  addProduto(p: Produto): void {
    this.carrinho.update((atual) => {
      const idx = atual.findIndex((i) => i.produto.id === p.id);
      if (idx >= 0) {
        const copy = [...atual];
        copy[idx] = { ...copy[idx], qtd: copy[idx].qtd + 1 };
        return copy;
      }
      return [...atual, { produto: p, qtd: 1 }];
    });
  }

  inc(id: number): void {
    this.carrinho.update((list) =>
      list.map((i) => (i.produto.id === id ? { ...i, qtd: i.qtd + 1 } : i)),
    );
  }

  dec(id: number): void {
    this.carrinho.update((list) =>
      list
        .map((i) => (i.produto.id === id ? { ...i, qtd: i.qtd - 1 } : i))
        .filter((i) => i.qtd > 0),
    );
  }

  remove(id: number): void {
    this.carrinho.update((list) => list.filter((i) => i.produto.id !== id));
  }

  limparCarrinho(): void {
    this.carrinho.set([]);
    this.desconto.set(0);
    this.frete.set(0);
    this.recebido.set(0);
    this.codigoBarras.set('');
    this.termo.set('');
    this.showPagamento.set(false);
    this.focusBarcode();
  }

  moeda(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // === PDV: leitura por “código de barras” ===
  lerCodigo(): void {
    const cod = this.codigoBarras().trim();
    if (!cod) return;

    const p =
      this.produtos().find((x) => x.sku === cod) ||
      this.produtos().find((x) => String(x.id) === cod);

    if (!p) {
      alert('Produto não encontrado (mock).');
      //this.codigoBarras.set('');
      this.focusBarcode();
      return;
    }

    this.addProduto(p);
    this.codigoBarras.set('');
    this.focusBarcode();
  }

  abrirPagamento(m: MetodoPagamento): void {
    if (!this.carrinho().length) return;
    this.metodo.set(m);
    this.recebido.set(m === 'DINHEIRO' ? this.total() : 0);
    this.showPagamento.set(true);
  }

  confirmarPagamento(): void {
    const payload = {
      itens: this.carrinho().map((i) => ({
        produtoId: i.produto.id,
        sku: i.produto.sku,
        qtd: i.qtd,
        preco: i.produto.preco,
      })),
      subtotal: this.subtotal(),
      desconto: this.desconto(),
      frete: this.frete(),
      total: this.total(),
      pagamento: {
        metodo: this.metodo(),
        recebido: this.metodo() === 'DINHEIRO' ? this.recebido() : undefined,
        troco: this.metodo() === 'DINHEIRO' ? this.troco() : undefined,
      },
    };

    console.log('VENDA FINALIZADA', payload);
    alert('Venda finalizada (mock). Veja o payload no console.');
    this.limparCarrinho();
  }

  get termoValue(): string {
    return this.termo();
  }
  set termoValue(v: string) {
    this.termo.set(v ?? '');
  }
  
  get codigoBarrasValue(): string {
    return this.codigoBarras();
  }
  set codigoBarrasValue(v: string) {
    this.codigoBarras.set(v ?? '');
  }
  
  get freteValue(): number {
    return this.frete();
  }
  set freteValue(v: number) {
    this.frete.set(+v || 0);
  }
  
  get descontoValue(): number {
    return this.desconto();
  }
  set descontoValue(v: number) {
    this.desconto.set(+v || 0);
  }
  
  get recebidoValue(): number {
    return this.recebido();
  }
  set recebidoValue(v: number) {
    this.recebido.set(+v || 0);
  }
  
}
